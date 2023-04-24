import inquirer, { Answers } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { drawTable } from "./table.js";
import { hotkeys } from "./hotkeys.js";

async function main() {
  inquirer.registerPrompt("searchHotkeys", inquirerPrompt);

  function searchHotkeys(answers: Answers, input = "") {
    return new Promise((resolve) => {
      const results = fuzzy.filter(input, hotkeys, {
        extract: (hotkey) => [...hotkey].toString(),
      });

      if (results.length === 0) resolve(["No results found"]);
      const matches = results.map((hotkey) => hotkeys[hotkey.index]);
      const table = drawTable(matches);

      resolve(table);
    });
  }

  try {
    const answers: Answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        default: "list",
        choices: [
          { name: "LIST", value: "list" },
          { name: "SEARCH", value: "search" },
          { name: "ADD", value: "add" },
          { name: "EDIT", value: "edit" },
          { name: "DELETE", value: "delete" },
          { name: "EXIT", value: "exit" },
        ],
      },
      {
        type: "searchHotkeys",
        name: "hotkey",
        suggestOnly: false,
        message: (answers) => `Select a hotkey to ${answers.action}`,
        searchText: "Searching...",
        emptyText: "Nothing found!",
        source: searchHotkeys,
        pageSize: 24,
      },
    ]);
    const chosenHotkey = answers.hotkey;
    console.log(chosenHotkey);
  } catch (err: any) {
    if ("isTtyError" in err) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.error(err);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
