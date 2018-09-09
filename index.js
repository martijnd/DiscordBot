require('dotenv').config();

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

const client = new Discord.Client();
const prefix = '!';

let command;
let args;

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

const commandList = (message) => {
  const embed = new Discord.RichEmbed()
    .setColor('#FF00FF')
    .setTitle('Overzicht')
    .addField('!play <Youtube-URL>', 'Speel een liedje van Youtube.')
    .addField('!weer <Stad>', 'Toont het huidige weer in de opgegeven stad.')
    .addField('!cat', 'Cute')
    .addField('!nummerfeitje <nummer>', 'Willekeurig feitje over het opgegeven nummer');
  message.channel.send(embed);
};

const play = (message) => {
  if (message.channel.type !== 'text') return;
  console.log(args);
  const { voiceChannel } = message.member;

  if (!voiceChannel) {
    message.reply('Je moet wel in een spraakkanaal zitten!');
    return;
  }

  voiceChannel.join().then((connection) => {
    const stream = ytdl(args[0], { filter: 'audioonly' });
    const dispatcher = connection.playStream(stream);

    dispatcher.on('end', () => voiceChannel.leave());
  });
};

const cat = (message) => {
  fetch('http://aws.random.cat/meow')
    .then(res => res.json())
    .then(body => message.channel.send(body.file))
    .catch(err => console.log(err));
};

const kick = (message) => {
  // grab the "first" mentioned user from the message
  // this will return a `User` object, just like `message.author`
  const taggedUser = message.mentions.users.first();

  message.channel.send(`You wanted to kick: ${taggedUser.username}`);
};

const weer = (message) => {
  const { WEER_API_URL: url } = process.env;
  const locatie = args[1] ? `${args[0]} ${args[1]}` : args[0];
  const embed = response => new Discord.RichEmbed()
    .setColor('#FFFF00')
    .setTitle(`Het weer in ${response.plaats}`)
    .addField('Temperatuur', `${response.temp} °C`)
    .addField('Max. temp', `${response.d0tmax} °C`, true)
    .addField('Min. temp', `${response.d0tmin} °C`, true)
    .setTimestamp();

  fetch(url + locatie)
    .then(res => res.json())
    .then((body) => {
      const response = body.liveweer[0];
      message.channel.send(embed(response));
    })
    .catch(err => console.log(err));
};

const nummerfeitje = (message) => {
  const url = `http://numbersapi.com/${args[0]}`;
  fetch(url)
    .then(res => res.text())
    .then(body => message.channel.send(body));
};

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  args = message.content.slice(prefix.length).split(' ');
  command = args.shift().toLowerCase();

  switch (command) {
    case 'commands':
      commandList(message);
      break;

    case 'play':
      play(message);
      break;

    case 'kick':
      kick(message);
      break;

    case 'poes':
      cat(message);
      break;

    case 'weer':
      weer(message);
      break;

    case 'nummerfeitje':
      nummerfeitje(message);
      break;

    default:
      message.channel.send('pong');
      break;
  }
});

client.login(process.env.TOKEN);
