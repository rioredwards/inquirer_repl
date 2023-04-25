import inquirer, { Answers } from "inquirer";
import fuzzy from "fuzzy";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { createTable } from "./table.js";
import { hotkeys } from "./hotkeys.js";

type ActionType = "list" | "search" | "add" | "edit" | "delete" | "exit";
type ActionNameType = "LIST" | "SEARCH" | "ADD" | "EDIT" | "DELETE" | "EXIT";

const choices: Array<{ name: ActionNameType; value: ActionType }> = [
  { name: "LIST", value: "list" },
  { name: "SEARCH", value: "search" },
  { name: "ADD", value: "add" },
  { name: "EDIT", value: "edit" },
  { name: "DELETE", value: "delete" },
  { name: "EXIT", value: "exit" },
];

async function main() {
  inquirer.registerPrompt("searchHotkeys", inquirerPrompt);

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

  function listHotkeys() {
    const table = createTable(hotkeys, "full");
    console.log(table.join("\n"));
  }

  try {
    const answers: Answers = await inquirer.prompt<Answers>([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        default: "list",
        choices: choices,
      },
      {
        type: "searchHotkeys",
        name: "hotkey",
        suggestOnly: false,
        when: (answers) => shouldAsk("search", answers),
        message: (answers) => `Select a hotkey to ${answers.action}`,
        searchText: "Searching...",
        emptyText: "Nothing found!",
        source: searchHotkeys,
        pageSize: 24,
      },
    ]);
    // const chosenHotkey = answers.hotkey;
    // console.log(chosenHotkey);
    if (answers.action === "list") listHotkeys();
  } catch (err: any) {
    if ("isTtyError" in err) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.error(err);
    }
  }
}

function shouldAsk(question: ActionType, answers: Answers) {
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

    default:
      return true;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
