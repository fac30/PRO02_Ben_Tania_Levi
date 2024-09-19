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

        const response = await interaction.reply({
            content: `${person} Which is better?`,
            components: [row],
        });

        // This method returns a Promise that resolves when any interaction passes its filter (if one is provided), or throws if none are received before the timeout.
        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'ocean') {
                await confirmation.update({ content: "That's an amazing choice!", components: [] });
            } else if (confirmation.customId === 'mountains') {
                await confirmation.update({ content: 'Fantastic decision!', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }


    },
};