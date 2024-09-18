const { Events } = require('discord.js');
const { ask } = require("../ai.js");

module.exports = {
	name: Events.MessageCreate, 
	async execute(client, message) {
		if (message.content.startsWith("!")) {
			try {
				const prompt = message.content;
				const answer = await ask(prompt); 
				const channel = await client.channels.fetch(message.channelId);
				await channel.send(answer);  // Send the response back to the Discord channel
			} catch (error) {
				console.error('Error handling message:', error);
			}
		}
	}
};

