module.exports = {
	start: start,
	updateMembers: updateMembers,
};

// Indicator for when visualiser is loaded with data and world generated
let visualiserReady = false;

// Visualiser data
const grid = [[]];
let users = new Map();
let onlineUsers = [];
const minSeparation = 2;

function start() {
	waitUntilData();
}

async function waitUntilData() {
	if (visualiserReady) {
		return;
	}
	else if (!users || users.size == 0) {
		console.log('Waiting for data ...');
		await sleep(2000);
		waitUntilData();
	}
	else {
		const readline = require('readline');
		const reader = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: false,
		});

		reader.on('line', function(line) {
			const command = line.trim();
			if (command === 'show') {
				renderWorld();
			}
			else if (command === 'show online') {
				renderWorld('online');
			}
			else if (command === 'show idle') {
				renderWorld('idle');
			}
			else if (command === 'show dnd') {
				renderWorld('dnd');
			}
			else if (command === 'groups') {
				// listGroups();
			}
			else if (command === 'chats') {
				// listVoiceChats();
			}
		});

		generateWorld();
		renderWorld();

		visualiserReady = true;
		console.log('World visualiser is ready');
	}
}

function generateWorld() {
	const maxUsers = (users.size < 100) ? users.size : 100;
	const rows = (minSeparation * 2 - 1) * Math.ceil(maxUsers / 3);
	const cols = rows;
	console.log(`Generating world with max users: ${maxUsers} and separation: ${minSeparation}`);

	// Clear online users
	onlineUsers = [];

	for (let i = 0; i < rows; i++) {
		grid[i] = new Array(cols);
	}

	users.forEach(user => {
		if (onlineUsers.size >= minSeparation) {
			return;
		}
		else if (user.presence.status === 'offline') {
			return;
		}
		const person = {
			x: randInt(cols),
			y: randInt(rows),
			data: user,
		};
		while (isCrowded(person)) {
			person.x = randInt(cols);
			person.y = randInt(rows);
		}
		onlineUsers.push(person);
		grid[person.x][person.y] = person;
	});
}

function renderWorld(filter = '') {
	for (let i = 0; i < grid.length; i++) {
		let line = '';
		for (let j = 0; j < grid[i].length; j++) {
			const person = grid[i][j];
			if (!person) {
				line += getRenderChar('offline') + ' ';
			}
			else if (filter && person.data.presence.status !== filter) {
				line += getRenderChar('offline') + ' ';
			}
			else {
				line += getRenderChar(person.data.presence.status) + ' ';
			}
		}
		console.log(line);
	}
}

function getRenderChar(status) {
	if (status === 'online') return 'o';
	else if (status === 'idle') return '-';
	else if (status === 'dnd') return 'x';
	else if (status === 'offline') return '.';
	else return '?';
}

function isCrowded(target) {
	for (const user of users) {
		if (squareDistance(user, target) < minSeparation ** 2) {
			return true;
		}
	}
	return false;
}

function squareDistance(a, b) {
	return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function randInt(max) {
	return Math.floor(Math.random() * max);
}

function updateMembers(members) {
	users = members;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}