import inquirer, { QuestionCollection } from "inquirer";

async function main() {
  let value: string;
  const answers = await inquirer.prompt({
    name: "value",
    type: "input",
    message: "What is your name?",
  });
  if (answers.value) {
    value = answers.value;
    console.log(`Hello ${value}`);
  } else {
    console.error("No value provided");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
