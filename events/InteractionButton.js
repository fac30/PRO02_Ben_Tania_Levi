const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
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
                if (customId === 'mountains') {
                    responseMessage = 'You chose Mountains! Great choice!';
                } else if (customId === 'ocean') {
                    responseMessage = 'You chose Ocean! Interesting choice!';
                }
    
                // Reply to the interaction with the response message
                await interaction.reply({
                    content: responseMessage,
                    ephemeral: true // This ensures the response is visible only to the user who clicked the button
                });
    
            }
		} 
};
