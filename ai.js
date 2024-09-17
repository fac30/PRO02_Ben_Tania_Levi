require('dotenv').config();

const { OpenAI } = require("openai");

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,});

async function ask(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",       
			messages: [
        { "role": "system", "content": "You are a a jira wizard that is able to tell us all about how agile project management works and how we should manage projects" },
        { "role": "user", "content": prompt }
      ],
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw new Error('Failed to fetch response from OpenAI API');
  }
}

module.exports = {
  ask,
};

// async function main() {
//   const response = await ask("Isn't Tania Amazing?");
//   console.log(response);
// }
//
// main();

// Export the ask function if you need to use it in other modules
