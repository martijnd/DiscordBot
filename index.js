require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.push(fs.readdirSync('.').filter(file => file.endsWith('cmds.js')));

let command;

for (const file of commandFiles) {
  if (file[0] === 'cmds.js') {
    command = require(`./${file[0]}`);
  } else {
    command = require(`./commands/${file}`);
  }

  client.commands.set(command.name, command);
}

const prefix = '!';

let args;

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  args = message.content.slice(prefix.length).split(' ');
  command = args.shift().toLowerCase();

  if (command === 'cmds') {
    client.commands.get(command).run(message, args);
    return;
  }

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).run(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.TOKEN);
