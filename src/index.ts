// Sandbox for inquirer: https://www.npmjs.com/package/inquirer#prompt

import inquirer, { Answers } from "inquirer";
import {
  actionQuestions,
  addQuestions,
  initializeInquirer,
  searchQuestions,
  shouldAsk,
} from "./inquirer.js";
import { listHotkeys } from "./hotkeys.js";

async function main() {
  initializeInquirer();
  let answers: Answers;

  try {
    answers = await inquirer.prompt(actionQuestions);
    if (shouldAsk("search", answers)) {
      answers = await inquirer.prompt(searchQuestions, answers);
    }
    console.log("answers (after search): ", answers);
    if (shouldAsk("add", answers)) {
      let continueAdding = true;
      async function ask(prevAnswers: Answers = {}) {
        const addAnswers = await inquirer.prompt(addQuestions, prevAnswers);
        continueAdding =
          !addAnswers.appIsCorrect ||
          !addAnswers.hotkeyIsCorrect ||
          !addAnswers.descriptionIsCorrect;
        if (continueAdding) {
          await ask(addAnswers);
        }
      }
      if (continueAdding) await ask();
    }
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
