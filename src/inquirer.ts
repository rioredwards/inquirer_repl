// Sandbox for inquirer: https://www.npmjs.com/package/inquirer#prompt

import inquirer, { Answers, QuestionCollection } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { createTable } from "./table.js";
import { HotkeyColumns, hotkeys } from "./hotkeys.js";
import separator from "inquirer/lib/objects/separator.js";
import { countCharsWithEmojis } from "./emojis.js";

type ActionType = "list" | "search" | "add" | "edit" | "delete" | "exit";
type ActionNameType = "LIST" | "SEARCH" | "ADD" | "EDIT" | "DELETE" | "EXIT";

function isActionType(question: ActionType | AddType): question is ActionType {
  switch (question) {
    case "list":
    case "search":
    case "add":
    case "edit":
    case "delete":
    case "exit":
      return true;
    default:
      return false;
  }
}

type AddType = "addApp" | "addHotkey" | "addDescription";

function isAddType(question: ActionType | AddType): question is AddType {
  switch (question) {
    case "addApp":
    case "addHotkey":
    case "addDescription":
      return true;
    default:
      return false;
  }
}

const actionChoices: Array<{ name: ActionNameType; value: ActionType }> = [
  { name: "LIST", value: "list" },
  { name: "SEARCH", value: "search" },
  { name: "ADD", value: "add" },
  { name: "EDIT", value: "edit" },
  { name: "DELETE", value: "delete" },
  { name: "EXIT", value: "exit" },
];

const keyChoices = [
  "⇧",
  "⌃",
  "⌘",
  "⌥",
  "⇥",
  "↩",
  "fn",
  "space",
  "⌫",
  "⎋",
  "↑",
  "↓",
  "←",
  "→",
  "⊞",
  "",
];

// name (to display in list), a value (to save in the answers hash), and a short (to display after selection)

export const actionQuestions: QuestionCollection = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    default: "list",
    choices: actionChoices,
  },
];

export const searchQuestions: QuestionCollection = [
  {
    type: "searchHotkeys",
    name: "selectedHotkey",
    suggestOnly: false,
    message: (answers: Answers) => `Select a hotkey to ${answers.action}`,
    searchText: "Searching...",
    emptyText: "Nothing found!",
    source: searchHotkeys,
    pageSize: 24,
  },
];

export const addQuestions: QuestionCollection = [
  {
    type: "addApp",
    name: "appToAdd",
    suggestOnly: true,
    message: "Add an app: ",
    source: searchAppChoices,
    loop: true,
    pageSize: 12,
    when: (answers) => shouldAsk("addApp", answers),
    default: (answers: Answers) => answers.appToAdd || null,
    askAnswered: true,
    validate: (input: string) => answerIsValid("addApp", input),
  },
  {
    type: "confirm",
    name: "appIsCorrect",
    message: (answers) => `Is this correct? ${answers.appToAdd}`,
    when: (answers) => shouldAsk("addApp", answers),
    default: true,
    askAnswered: true,
  },
  {
    type: "addHotkey",
    name: "hotkeyToAdd",
    suggestOnly: true,
    message: "Add a keyboard shortcut: ",
    source: searchKeyChoices,
    pageSize: 12,
    loop: true,
    default: (answers: Answers) => answers.hotkeyToAdd || null,
    when: (answers) => shouldAsk("addHotkey", answers),
    validate: (input: string) => answerIsValid("addHotkey", input),
    askAnswered: true,
  },
  {
    type: "confirm",
    name: "hotkeyIsCorrect",
    message: (answers) => `Is this correct? ${answers.hotkeyToAdd}`,
    when: (answers) => shouldAsk("addHotkey", answers),
    default: true,
    askAnswered: true,
  },
  {
    type: "input",
    name: "descriptionToAdd",
    message: "Add a description: ",
    default: (answers: Answers) => answers.descriptionToAdd || null,
    when: (answers) => shouldAsk("addDescription", answers),
    validate: (input: string) => answerIsValid("addDescription", input),
    askAnswered: true,
  },
  {
    type: "confirm",
    name: "descriptionIsCorrect",
    message: (answers) => `Is this correct? ${answers.descriptionToAdd}`,
    when: (answers) => shouldAsk("addDescription", answers),
    default: true,
    askAnswered: true,
  },
];

export const initializeInquirer = () => {
  inquirer.registerPrompt("searchHotkeys", inquirerPrompt);
  inquirer.registerPrompt("addHotkey", inquirerPrompt);
  inquirer.registerPrompt("addApp", inquirerPrompt);
};

function searchHotkeys(_: Answers, input = "") {
  return new Promise((resolve) => {
    const results = fuzzy.filter(input, hotkeys, {
      extract: (hotkey) => [...hotkey].toString(),
    });

    if (results.length === 0) resolve(["No results found"]);
    const matches = results.map((hotkey) => hotkeys[hotkey.index]);
    const table = createTable(matches, "cellsOnly");
    resolve(table);
  });
}

function getLastValEntered(input: string) {
  if (!input || input.length === 0) return null;
  if (input.length === 1) return input;
  const inputWords = input.trim().split(" ");
  const lastWordOrChar = inputWords[inputWords.length - 1];
  return lastWordOrChar;
}

function getIdxLastVal(input: string, choices: string[]) {
  const lastValEntered = getLastValEntered(input);
  if (!lastValEntered) return null;
  const idxLastVal = choices.findIndex((choice) =>
    choice.includes(lastValEntered)
  );
  return idxLastVal !== -1 ? idxLastVal : null;
}

function searchKeyChoices(answers: Answers, input = "") {
  return new Promise((resolve) => {
    let choices: string[] = [...keyChoices];
    let updatedChoices: string[] = [];
    let idxLastVal = getIdxLastVal(input, choices);

    // if there is a previous answer (user is editing), add it to the beginning of choices
    // After selecting it, remove it from choices array
    if (answers.hotkeyToAdd && !input.includes(answers.hotkeyToAdd)) {
      choices.unshift(answers.hotkeyToAdd);
      if (idxLastVal) idxLastVal++;
    }

    // This is a hack to keep the choices from jumping around while typing
    if (idxLastVal) {
      // Match the last input value to the choices array
      // and rearrange the choices array so that the last input value is first
      const foundVal = choices[idxLastVal];
      const valuesBefore = choices.slice(0, idxLastVal);
      const valuesAfter = choices.slice(idxLastVal + 1);
      updatedChoices = [foundVal, ...valuesAfter, ...valuesBefore];
    }

    if (updatedChoices.length !== 0) choices = updatedChoices;
    // prepend the input to the choices
    choices = choices.map((choice) => {
      // While iterating, if the choice is the previous answer, return it without modification
      // Normally this value will be removed from the array after selection...
      // But if the user modifies that segment of the string, it will be added back to the array
      if (choice === answers.hotkeyToAdd) return choice;
      return input ? `${input}+ ${choice}` : choice;
    });

    resolve(choices);
  });
}

function getAppChoices() {
  const apps = hotkeys.map((hotkey) => hotkey[HotkeyColumns.App]);
  return apps.length === 0 ? ["💻 All"] : [...new Set(apps)];
}

function searchAppChoices(answers: Answers, input = "") {
  return new Promise((resolve) => {
    let choices: (string | separator)[] = [...keyChoices];
    choices = getAppChoices();

    // If there is a previous answer (user is editing), and user hasn't already selected or modified it
    if (answers.appToAdd && !input.includes(answers.hotkeyToAdd)) {
      // If this answer is already in the choices array, remove it from the original position and add it to the beginning
      if (choices.includes(answers.appToAdd)) {
        choices = choices.filter((choice) => choice !== answers.appToAdd);
        choices.unshift(answers.appToAdd);
      }
    }
    choices.unshift(new inquirer.Separator());

    resolve(choices);
  });
}

// This function determines if the user should be asked a question based on their previous answers
export function shouldAsk(question: ActionType | AddType, answers: Answers) {
  if (isActionType(question)) {
    switch (question) {
      case "search":
        switch (answers.action) {
          case "search":
          case "edit":
          case "delete":
            return true;
          default:
            return false;
        }
      case "add":
        switch (answers.action) {
          case "add":
            return true;
          default:
            return false;
        }
      case "exit":
        return false;
      default:
        return false;
    }
  }
  if (isAddType(question)) {
    switch (question) {
      case "addApp":
        return !answers.appIsCorrect;
      case "addHotkey":
        return answers.appIsCorrect && !answers.hotkeyIsCorrect;
      case "addDescription":
        return (
          answers.appIsCorrect &&
          answers.hotkeyIsCorrect &&
          !answers.descriptionIsCorrect
        );
      default:
        return false;
    }
  }
}

// Call this function to validate answers
export function answerIsValid(question: AddType, answer: any) {
  switch (question) {
    case "addApp":
      if (!answer)
        return "TAB to select from list • TYPE to add/modify entry • ENTER to confirm";
      if (countCharsWithEmojis(answer) > 16) {
        return `App name must be 16 characters or less: (${countCharsWithEmojis(
          answer
        )} characters)`;
      }
      return true;
    case "addHotkey":
      if (!answer)
        return "TAB to select from list • SPACE to add next key • TYPE to add/modify entry • ENTER to confirm";
      if (countCharsWithEmojis(answer) > 16) {
        return `App name must be 16 characters or less: (${countCharsWithEmojis(
          answer
        )} characters)`;
      }
      return true;
    case "addDescription":
      if (!answer) return "TYPE to add/modify entry • ENTER to confirm";
      if (countCharsWithEmojis(answer) > 80) {
        return `Description must be 80 characters or less: (${countCharsWithEmojis(
          answer
        )} characters)`;
      }
      return true;
    default:
      return false;
  }
}
