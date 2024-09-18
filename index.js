const fs = require('node:fs'); // The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const path = require('node:path'); //The path module is Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//use .env
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Intent to receive guild-related events.
    GatewayIntentBits.GuildMessages, // Intent to receive messages in guilds.
    GatewayIntentBits.MessageContent, // Intent to access the content of messages.
  ],
});

client.commands = new Collection(); // Collection is used to store and efficiently retrieve commands for execution.
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands'); // path.join() helps to construct a path to the commands directory.
const commandFolders = fs.readdirSync(foldersPath); // The first fs.readdirSync() method then reads the path to the directory and returns an array of all the folder names it contains, currently ['utility']. 

for (const folder of commandFolders) {
	// Constructs the path to each folder and retrieves the list of .js command files.
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // The second fs.readdirSync() method reads the path to this directory and returns an array of all the file names they contain, currently ['ping.js', 'server.js', 'user.js']. 
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Checks if both data and execute properties are present (required for command functionality).
		if ('data' in command && 'execute' in command) {
			// Adds the command to client.commands and assigns it a category based on the folder name.
			command.category = folder;
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events'); // // Constructs the path to the events directory.
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // // Reads the path to the directory and returns an array of all event files, currently ['ready.js', 'interactionCreate.js'].

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	// Registers the event with the Client instance:
	if (event.once) {
		// If event.once is true, it uses client.once() to set up a one-time listener.
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		// Otherwise, it uses client.on() to set up a regular listener.
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}



client.login(token);

