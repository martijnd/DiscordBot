require('dotenv').config();
const Discord = require('discord.js');
const cmd = require('./commands');

const client = new Discord.Client();
const prefix = '!';

let command;
let args;

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  args = message.content.slice(prefix.length).split(' ');
  command = args.shift().toLowerCase();

  switch (command) {
    case 'cmds':
      cmd.commandList(message);
      break;

    case 'play':
      cmd.play(message);
      break;

    case 'oof':
      cmd.oof(message);
      break;

    case 'poes':
      cmd.cat(message);
      break;

    case 'weer':
      cmd.weer(args, message);
      break;

    case 'nummerfeitje':
      cmd.nummerfeitje(args, message);
      break;

    default:
      message.channel.send('pong');
      break;
  }
});

client.login(process.env.TOKEN);
