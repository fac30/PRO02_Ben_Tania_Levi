const { Events } = require('discord.js');
const { ask } = require("../ai.js")

module.exports = {
	name: Events.MessageCreate, 
	async execute(client, message) {
		// if (message.author.bot) return;
	if (message.content.startsWith("!")) {
		try {
			const prompt = message.content;
			const answer = await ask(prompt);
			const channel = await client.channels.fetch(message.channelId);
			await channel.send(answer)
			} catch (error) {
				console.error('Error handling message: ', error);
			}
		}
	}
};

//
// client.on(Events.MessageCreate, async message => {
//   if (message.content.startsWith("!")) {
//     const prompt = message.content.substring(1); // Remove the exclamation mark from the message
//     const answer = await ask(prompt); // Prompt GPT-3
//     client.channels.fetch(message.channelId).then(channel => channel.send(answer));
//   }
// });
//
//
//
