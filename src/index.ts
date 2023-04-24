import inquirer, { Answers } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { drawTable } from "./table.js";
import { hotkeys } from "./hotkeys.js";

async function main() {
  inquirer.registerPrompt("autocomplete", inquirerPrompt);

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
        type: "autocomplete",
        name: "hotkeys",
        suggestOnly: false,
        message: "Search for a hotkey",
        searchText: "Searching...",
        emptyText: "Nothing found!",
        source: searchHotkeys,
        pageSize: 24,
      },
    ]);
    console.log(answers);
  } catch (err) {
    console.error(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
