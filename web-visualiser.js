module.exports = {
	start: start,
};

const discord = require('./index.js');
const dotenv = require('dotenv');
const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');

const port = 53134;

function start() {
	// Load .env file
	dotenv.config();
	http.createServer((req, res) => {
		let responseCode = 404;
		let content = '404 Error';

		const urlObj = url.parse(req.url, true);
		if (urlObj.query.code) {
			const accessCode = urlObj.query.code;
			console.log(`The access code is: ${accessCode}`);
			authenticateAsUser(accessCode);
		}
		if (urlObj.pathname === '/') {
			responseCode = 200;
			content = fs.readFileSync('./index.html');
		}

		res.writeHead(responseCode, {
			'content-type': 'text/html;charset=utf-8',
		});

		res.write(content);
		res.end();
	}).listen(port);

	console.log('Web visualiser is ready');
}

function authenticateAsUser(accessCode) {
	const data = new FormData();

	data.append('client_id', process.env.CLIENT_ID);
	data.append('client_secret', process.env.CLIENT_SECRET);
	data.append('grant_type', 'authorization_code');
	data.append('redirect_uri', process.env.REDIRECT_URI);
	data.append('scope', 'identify');
	data.append('code', accessCode);

	fetch('https://discordapp.com/api/oauth2/token', {
		method: 'POST',
		body: data,
	})
		.then(res => res.json())
		.then(json => discord.connect(json['access_token']))
		.catch(err => console.error(err));
}