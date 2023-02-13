import { Configuration, OpenAIApi } from 'openai';
import fetch from "node-fetch";
import inquirer from 'inquirer';

import "dotenv/config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const getFacts = async () => {
  const response = await fetch("https://catfact.ninja/facts");
  const { data } = await response.json();

  return data.map(({ fact }) => fact);
};

const verifyCatFacts = async () => {
  /** @type {string[]} */
  const facts = await getFacts();

  const { data, ...completion } = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Verify whether or not the following facts about cats are true.
- ${facts.slice(0, 4).join("\n - ")}`,
    temperature: 0.6,
  });
  console.log(completion);
  console.log(data);
  return data;
};

let shouldContinue = true;
while (shouldContinue) {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: ["Verify cat facts", "Exit"]
    }
  ]);

  try {
    if (choice === "Verify cat facts") {
      const data = await verifyCatFacts();
      console.log(data);
    } else {
      shouldContinue = false;
    }
  } catch (err) {
    console.error(err);;
  }

}