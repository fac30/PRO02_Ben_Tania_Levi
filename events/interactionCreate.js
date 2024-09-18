const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a slash command
        if (!interaction.isChatInputCommand()) return;
            const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
		    
			let responseMessage = '';
            const customId = interaction.customId;

			// Determine the response based on the button pressed
			if (customId === 'ocean') {
				responseMessage = 'You chose Ocean! Great choice!';
			} else if (customId === 'mountains') {
				responseMessage = 'You chose Mountains! Interesting choice!';
			}

			// Reply to the interaction with the response message
			await interaction.reply({
				content: responseMessage,
				ephemeral: true // This ensures the response is visible only to the user who clicked the button
			});
	    }

		
		/////////// COOLDOWN BLOCK
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
	},
};


