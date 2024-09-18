const { ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Choose the buttons'),
    async execute(interaction) {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
        const person = `${interaction.user.username}`;


        const mountains = new ButtonBuilder()
        .setCustomId('mountains')
        .setLabel('choose mountains')
        .setStyle(ButtonStyle.Success);

        const ocean = new ButtonBuilder()
        .setCustomId('ocean')
        .setLabel('choose ocean')
        .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
                .addComponents(ocean, mountains);

            await interaction.reply({
                content: `What is better?`,
                components: [row],
            });

    },
};