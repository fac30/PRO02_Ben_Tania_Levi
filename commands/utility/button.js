const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Choose'),
    async execute(interaction) {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
        const person = `${interaction.user.username}`;


        const mountains = new ButtonBuilder()
            .setCustomId('mountains')
            .setLabel('Mountains')
            .setStyle(ButtonStyle.Success)
            .setEmoji('⛰️');

        const ocean = new ButtonBuilder()
            .setCustomId('ocean')
            .setLabel('Ocean')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🌊');

        const row = new ActionRowBuilder()
                .addComponents(ocean, mountains);

            await interaction.reply({
                content: `${person} Which is better?`,
                components: [row],
            });

    },
};