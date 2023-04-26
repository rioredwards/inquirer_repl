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
    if (shouldAsk("add", answers)) {
      const keyAccumulator: Answers = {
        accumulatedValue: "",
      };
      let numKeys = 0;

      async function ask() {
        const addKeyAnswer = await inquirer.prompt(
          addQuestions,
          keyAccumulator
        );
        numKeys++;
        if (addKeyAnswer.hotkeyToAdd === "Done") {
          console.log("Your hotkey: ", keyAccumulator.accumulatedValue);
          return;
        }
        if (numKeys === 1) {
          keyAccumulator.accumulatedValue = addKeyAnswer.hotkeyToAdd;
        } else {
          keyAccumulator.accumulatedValue += " + " + addKeyAnswer.hotkeyToAdd;
        }
        await ask();
      }

      await ask();
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
