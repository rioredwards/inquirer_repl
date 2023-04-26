// Sandbox for inquirer: https://www.npmjs.com/package/inquirer#prompt

import inquirer, { Answers, QuestionCollection } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { createTable } from "./table.js";
import { HotkeyColumns, hotkeys } from "./hotkeys.js";
import separator from "inquirer/lib/objects/separator.js";

type ActionType = "list" | "search" | "add" | "edit" | "delete" | "exit";
type ActionNameType = "LIST" | "SEARCH" | "ADD" | "EDIT" | "DELETE" | "EXIT";

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
  // {
  //   type: "list",
  //   name: "app",
  //   message: "Select an app",
  //   choices: getAppChoices(),
  //   default: "All",
  // },
  {
    type: "addHotkey",
    name: "hotkeyToAdd",
    suggestOnly: true,
    message: (answers: Answers) => {
      const displayedMessage = answers?.accumulatedValue
        ? "Add to your keyboard shortcut: " + answers?.accumulatedValue + " + "
        : "Add a keyboard shortcut: ";
      return displayedMessage;
    },
    source: searchKeyChoices,
    // default: (answers: Answers) => {
    //   const displayedHotkey = answers?.accumulatedValue
    //     ? `${answers?.accumulatedValue} + _`
    //     : undefined;
    //   return displayedHotkey;
    // },
    pageSize: 24,
    validate: (input: string) => {
      if (!input) return "Please enter a key";
      return true;
    },
  },
  // {
  //   type: "confirm",
  //   name: "askAgain",
  //   when: (answers: Answers) => answers.hotkeyToAdd !== "",
  //   message: "Add another key? (hit enter for YES)",
  //   default: true,
  // },
];

export const initializeInquirer = () => {
  inquirer.registerPrompt("searchHotkeys", inquirerPrompt);
  inquirer.registerPrompt("addHotkey", inquirerPrompt);
};

function searchHotkeys(answers: Answers, input = "") {
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

function searchKeyChoices(answers: Answers, input = "") {
  return new Promise((resolve) => {
    const doneChoices = [new inquirer.Separator(), "Done"];
    const choices = [...keyChoices, ...doneChoices];

    resolve(choices);
  });
}

function getAppChoices() {
  const apps = hotkeys.map((hotkey) => hotkey[HotkeyColumns.App]);
  return apps.length === 0 ? ["All"] : [...new Set(apps)];
}

// This function determines if the user should be asked a question based on their previous answers
export function shouldAsk(question: ActionType, answers: Answers) {
  const action = answers.action;
  switch (question) {
    case "search":
      switch (action) {
        case "search":
        case "edit":
        case "delete":
          return true;
        default:
          return false;
      }
    case "add":
      switch (action) {
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
