const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	// Events.ClientReady is a constant that represents the 'ready' event, which is emitted when the bot has successfully connected to Discord and is ready to start interacting.
	// The once property is set to true, indicating that this event handler should only run once.
	once: true, //This means that the execute function will be called only the first time the 'ready' event is emitted and not on subsequent 'ready' events.
	// The execute function is the event handler that will be called when the 'ready' event is emitted.
	// It takes a client parameter, which represents the bot client that emitted the event.
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
