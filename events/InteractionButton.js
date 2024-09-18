const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

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
    },
};
