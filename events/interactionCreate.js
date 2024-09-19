// that handles the InteractionCreate event in a Discord bot
const { Events, Collection } = require('discord.js'); // Events provides predefined event names, while Collection is a collection-like data structure used to store and manage data, such as command cooldowns.

module.exports = {
	name: Events.InteractionCreate, // specifies that this handler is for the 'interactionCreate' event, which is emitted whenever an interaction occurs (e.g., a command is invoked).
	async execute(message, interaction) { // It is marked as async because it involves asynchronous operations, such as interacting with the Discord API.
		// In this context, message is not used, and interaction represents the interaction object that triggered the event.
		if (!interaction.isChatInputCommand()) return; //This line checks if the interaction is a chat input command (i.e., a slash command). If not, the function exits early. This ensures that only interactions that are commands are processed by this handler.
        // Retrieves the command associated with the interaction from the commands collection of the client.
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		/////////// COOLDOWN BLOCK

		// - This block handles the command cooldown logic.
        // cooldowns is a Collection that tracks the cooldowns for each command.
        //  If the command's cooldown data does not exist in cooldowns, a new Collection is created for it.
        //  The current time is retrieved with Date.now().
        //  The cooldown amount is calculated from the command's cooldown property (in seconds) or a default duration of 3 seconds.
        //  If the user has already triggered the command recently, it calculates if the cooldown period has expired.
        //  If the cooldown is still active, a reply is sent to the user indicating how long they must wait before using the command again.
        //  If the cooldown has expired or does not exist, the user’s timestamp is updated, and a timeout is set to remove their cooldown entry after the cooldown period.

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		////////////////////////////////

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};