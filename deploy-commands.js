// This file will be used to register and update the slash commands for your bot application.

// REST is used to interact with the Discord API for sending requests, while Routes provides a structured way to reference API endpoints.
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json'); // These values are critical for authenticating the bot and deploying the commands to the correct Discord server.
const fs = require('node:fs'); // These lines import Node.js’ built-in modules fs (file system) and path, which are used to handle reading files and paths from the filesystem.
const path = require('node:path');

const commands = []; // Initializes an empty array commands that will later store all the commands read from the commands folder. This will be passed to the Discord API to register the commands.
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands'); //generates the absolute path to the commands directory using __dirname, which refers to the current directory.
const commandFolders = fs.readdirSync(foldersPath); // reads all folder names within the commands directory. This assumes that your commands are organized in subfolders.

// This loop iterates over each folder found in the commands directory.
for (const folder of commandFolders) {

	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	// This nested loop processes each command file found.
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		// The command file is required (imported) using require(filePath)
		const command = require(filePath);
		if ('data' in command && 'execute' in command) { // It checks if both data and execute properties are present in the command file. These are necessary for defining a slash command and its behavior.
			commands.push(command.data.toJSON()); // it converts the command’s data to JSON format 
		} else {
			// If either property is missing, a warning is logged indicating the issue.
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Initializes an instance of the REST class and sets the bot token for authorization with the Discord API.
const rest = new REST().setToken(token);

// and deploy your commands!
// This is an immediately invoked asynchronous function (async IIFE). It wraps the deployment logic in a try/catch block.
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// The rest.put() method sends a PUT request to the Discord API, using the Routes.applicationGuildCommands(clientId, guildId) route.
		const data = await rest.put(
			// This route is used to update or deploy the commands for a specific guild (server).
			Routes.applicationGuildCommands(clientId, guildId),
			// The request sends the commands array in the request body to replace all previously registered commands with the new set.
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


// Once you fill in these values, run node deploy-commands.js in your project directory to register your commands to the guild specified.