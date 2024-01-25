const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	removeAllCommands();
});

client.on('messageCreate', (message) => {});

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeAllCommands() {
	try {
		const response = await axios.get(
			`https://discord.com/api/v9/applications/${clientId}/guilds/${guildId}/commands`,
			{
				headers: {
					Authorization: `Bot ${token}`,
				},
			}
		);

		const commands = response.data;

		for (const command of commands) {
			await axios.delete(
				`https://discord.com/api/v9/applications/${clientId}/guilds/${guildId}/commands/${command.id}`,
				{
					headers: {
						Authorization: `Bot ${token}`,
					},
				}
			);

			await sleep(1000);
		}

		console.log('All commands removed');
	} catch (error) {
		console.error('Error removing commands:', error.message);
	}
}

client.login(token);
