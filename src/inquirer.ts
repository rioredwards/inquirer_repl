// Sandbox for inquirer: https://www.npmjs.com/package/inquirer#prompt

import inquirer, { Answers, QuestionCollection } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { createTable } from "./table.js";
import { hotkeys } from "./hotkeys.js";

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
  { name: "⇧ Shift", value: "⇧" },
  { name: "⌃ Ctrl", value: "⌃" },
  { name: "⌘ Cmd", value: "⌘" },
  { name: "⌥ Alt/Option", value: "⌥" },
  { name: "Fn", value: "FN" },
  { name: "⇥ Tab", value: "⇥" },
  { name: "↩ Enter/Return", value: "↩" },
  { name: "Space", value: "Space" },
  { name: "⌫ Backspace/Delete", value: "⌫" },
  { name: "⎋ Esc", value: "⎋" },
  { name: "↑ Up", value: "↑" },
  { name: "↓ Down", value: "↓" },
  { name: "← Left", value: "←" },
  { name: "→ Right", value: "→" },
  { name: "⊞ Win", value: "⊞" },
  { name: " Apple", value: "" },
];

export const actionQuestions: QuestionCollection = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    default: "list",
    choices: actionChoices,
  },
  {
    type: "addHotkey",
    name: "hotkeyToAdd",
    suggestOnly: true,
    when: (answers: Answers) => shouldAsk("add", answers),
    message: "Add a hotkey",
    searchText: "Searching...",
    emptyText: "Nothing found!",
    source: searchHotkeys,
    pageSize: 24,
  },
];

export const addQuestions: QuestionCollection = [
  {
    type: "addHotkey",
    name: "hotkeyToAdd",
    suggestOnly: true,
    when: (answers: Answers) => shouldAsk("add", answers),
    message: "Add a hotkey",
    searchText: "Searching...",
    emptyText: "Nothing found!",
    source: searchHotkeys,
    pageSize: 24,
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

export function listHotkeys() {
  const table = createTable(hotkeys, "full");
  console.log(table.join("\n"));
}
