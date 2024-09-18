// The individual command file, con	taining definitions and functionality of the command.
// SlashCommandBuilder is used to create slash commands, a type of interaction in Discord, which allows users to run bot commands by typing / followed by the command name
const { SlashCommandBuilder } = require('discord.js');

//The module.exports syntax is used to export this command file as a module in Node.js. 
// This allows other parts of the bot, like the command handler, to import and use the command logic
module.exports = {
	// a cooldown property for the command, which sets a 5-second cooldown between uses of the command by the same user. 
	// Cooldowns help prevent spam by limiting how frequently users can trigger the command.
  cooldown: 5,
    //This object defines the command’s basic information.
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	// function defines what the bot should do when this command is triggered.
	// the object representing the user’s interaction with the bot
	async execute(interaction) {
		// sends a response back to the user when the command is invoked.
		await interaction.reply('Pong!');
	},
};
