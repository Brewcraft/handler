const fs = require('fs');
const config = require('./config.json');
const mineflayer = require('mineflayer');

const prefix = config.chatPrefix || '!';

const options = {
	host: config.server_address || 'localhost',
	port: parseInt(config.server_port) || '25565',
	username: config.bot_username || 'mineflayer-bot',
};

const bot = mineflayer.createBot(options);
const commandfiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

const commands = [];

for (const val of commandfiles) {
	commands.push(val.replace('.js', ''));
}

bot.on('chat', (username, message) => {
	if (!message.startsWith(prefix) || username === bot.username) return;

	const args = message.slice(prefix.length).trim().split(/ +/);

	const command = args.shift().toLowerCase();

	if (!commands.includes(command)) return;

	const torun = require(__dirname + '/commands/' + command + '.js');

	torun.execute(bot, args);
});

bot.on('kicked', console.log);
bot.on('error', console.log);