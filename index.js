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
      cmd.commands.play.run(message);
      break;

    case 'oof':
      cmd.commands.oof.run(message);
      break;

    case 'poes':
      cmd.commands.cat.run(message);
      break;

    case 'weer':
      cmd.commands.weer.run(args, message);
      break;

    case 'nummerfeitje':
      cmd.commands.nummerfeitje.run(args, message);
      break;

    default:
      message.channel.send('pong');
      break;
  }
});

client.login(process.env.TOKEN);
