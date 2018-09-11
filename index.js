require('dotenv').config();
const Discord = require('discord.js');
const { commands } = require('./commands');

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
      try {
        commands.commandList(message);
      } catch (error) {
        console.log(error);
      }
      break;

    case 'play':
      try {
        commands.play.run(message, args);
      } catch (error) {
        console.log(error);
      }
      break;

    case 'oof':
      try {
        commands.oof.run(message);
      } catch (error) {
        console.log(error);
      }
      break;

    case 'poes':
      try {
        commands.cat.run(message);
      } catch (error) {
        console.log(error);
      }
      break;

    case 'weer':
      try {
        commands.weer.run(message, args);
      } catch (error) {
        console.log(error);
      }
      break;

    case 'nummerfeitje':
      try {
        commands.nummerfeitje.run(message, args);
      } catch (error) {
        console.log(error);
      }

      break;

    default:
      message.channel.send('pong');
      break;
  }
});

client.login(process.env.TOKEN);
