// Sandbox for inquirer: https://www.npmjs.com/package/inquirer#prompt

import inquirer, { Answers } from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import {
  actionQuestions,
  listHotkeys,
  searchQuestions,
  shouldAsk,
} from "./inquirer.js";

async function main() {
  inquirer.registerPrompt("searchHotkeys", inquirerPrompt);
  inquirer.registerPrompt("addHotkey", inquirerPrompt);
  let answers: Answers;

  try {
    answers = await inquirer.prompt(actionQuestions);
    if (shouldAsk("search", answers)) {
      answers = await inquirer.prompt(searchQuestions, answers);
    }
    // if (shouldAsk("add", answers)) {
    //   answers = await inquirer.prompt(addQuestions);
    // }
    if (answers.action === "list") listHotkeys();
    if (answers.action === "exit") process.exit(0);
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
