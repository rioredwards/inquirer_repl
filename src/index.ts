/**
 * List prompt example
 */

import inquirer from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { drawTable } from "./table.js";
import { hotkeys } from "./hotkeys.js";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

function searchHotkeys(answers: any, input = "") {
  return new Promise((resolve) => {
    const results = fuzzy.filter(input, hotkeys, {
      extract: (el) => (el[0] + el[2]).toString(),
    });

    const matches = results.map((el) => hotkeys[el.index]);
    const table = drawTable(matches);

    resolve(table);
  });
}

inquirer
  .prompt([
    {
      type: "autocomplete",
      name: "hotkeys",
      suggestOnly: false,
      message: "Search for a hotkey",
      searchText: "Searching...",
      emptyText: "Nothing found!",
      source: searchHotkeys,
      pageSize: 24,
    },
  ])
  .then((answers) => {
    console.log(answers);
  });
