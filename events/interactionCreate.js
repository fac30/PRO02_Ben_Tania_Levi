const { Events } = require('discord.js');

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
        } 
        // Check if the interaction is a button click
        else if (interaction.isButton()) {
            let responseMessage = '';
            const customId = interaction.customId;

            // Handle button clicks
            if (customId === 'ocean') {
                responseMessage = 'You chose Ocean! Great choice!';
            } else if (customId === 'mountains') {
                responseMessage = 'You chose Mountains! Interesting choice!';
            }

            // Reply to the interaction
            await interaction.reply({
                content: responseMessage,
                ephemeral: true // This ensures the response is visible only to the user who clicked the button
            });
        }
    },
};