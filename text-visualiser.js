module.exports = {
	start: start,
};

const rows = 12;
const cols = 12;

const minSeparation = 2;

const grid = [];
// const games = {};
const users = [];

function start() {
	const readline = require('readline');
	const reader = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	});

	reader.on('line', function(line) {
		if (line === 'show') {
			renderWorld();
		}
	});

	generateWorld();
	renderWorld();
	console.log('World visualiser is ready');
}

function generateWorld() {
	for (let i = 0; i < rows; i++) {
		grid[i] = new Array(cols);
	}

	const people = 10;
	for (let i = 0; i < people; i++) {
		const person = {
			x: randInt(cols),
			y: randInt(rows),
		};
		while (isCrowded(person)) {
			person.x = randInt(cols);
			person.y = randInt(rows);
		}
		users.push(person);
		grid[person.x][person.y] = person;
	}
}

function renderWorld() {
	for (let i = 0; i < grid.length; i++) {
		let line = '';
		for (let j = 0; j < grid[i].length; j++) {
			const person = grid[i][j];
			line += (person) ? 'o' : '.';
			line += ' ';
		}
		console.log(line);
	}
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
