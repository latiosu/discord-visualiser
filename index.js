/**
 * Reads the state of the server and generate a visualisation.
 */

// Import dotenv module
const dotenv = require('dotenv');

// Load configuration from .env file
dotenv.config();

// Import discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => console.log('I am ready!'));

// Record presence changes of users
client.on('presenceUpdate', (oldMember, newMember) => {
	const { user } = newMember;
	if (!oldMember.presence.game && newMember.presence.game) {
		console.log(`[${newMember.guild.name}] ${user.username} is now ${parsePresenceType(newMember.presence.game.type)} ${newMember.presence.game.name}`);
	}
	else if (oldMember.presence.game && !newMember.presence.game) {
		console.log(`[${newMember.guild.name}] ${user.username} has stopped ${parsePresenceType(oldMember.presence.game.type)} ${oldMember.presence.game.name}`);
	}
	else if (oldMember.presence.game && !oldMember.presence.game.equals(newMember.presence.game)) {
		console.log(`[${newMember.guild.name}] ${user.username} is now ${parsePresenceType(newMember.presence.game.type)} ${newMember.presence.game.name}`);
	}
});

// Record messages and the channel it was sent in
client.on('message', message => {
	console.log(`[${message.guild.name}] ${message.author.username} said ${message.content} (in ${message.channel.name})`);
});

// Record emoji reactions
client.on('messageReactionAdd', (messageReaction, user) => {
	console.log(`[${messageReaction.message.guild.name}] ${user.username} reacted with ${messageReaction.emoji.name}`);
});

// Record voice channel updates
client.on('voiceStateUpdate', (oldMember, newMember) => {
	const { user } = newMember;
	if (!oldMember.voiceChannel && newMember.voiceChannel) {
		console.log(`[${newMember.guild.name}] ${user.username} has joined voice channel ${newMember.voiceChannel.name}`);
	}
	else if (oldMember.voiceChannel && !newMember.voiceChannel) {
		console.log(`[${newMember.guild.name}] ${user.username} has left voice channel ${oldMember.voiceChannel.name}`);
	}
	else if (oldMember.voiceChannel && newMember.voiceChannel && !oldMember.voiceChannel.equals(newMember.voiceChannel)) {
		console.log(`[${newMember.guild.name}] ${user.username} has joined voice channel ${newMember.voiceChannel.name}`);
	}
});

function parsePresenceType(type) {
	if (type === 0) { return 'playing'; }
	else if (type === 1) { return 'streaming'; }
	else if (type === 2) { return 'listening to'; }
	else if (type === 3) { return 'watching'; }
	else { return 'doing something'; }
}

client.login(process.env.DISCORD_TOKEN);