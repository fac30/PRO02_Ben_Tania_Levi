const row = new ActionRowBuilder()
	.addComponents(component);

await interaction.reply({ components: [row] });