require('dotenv').config();

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

let args;

const commandList = (message) => {
  const embed = new Discord.RichEmbed()
    .setColor('#FF00FF')
    .setTitle('Overzicht')
    .addField('!play <Youtube-URL>', 'Speel een liedje van Youtube.')
    .addField('!oof', 'oof')
    .addField('!weer <Stad>', 'Toont het huidige weer in de opgegeven stad.')
    .addField('!cat', 'Cute')
    .addField('!nummerfeitje <nummer>', 'Willekeurig feitje over het opgegeven nummer');
  message.channel.send(embed);
};

const play = (message) => {
  if (message.channel.type !== 'text') return;

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

const oof = (message) => {
  if (message.channel.type !== 'text') return;

  const { voiceChannel } = message.member;

  if (!voiceChannel) {
    message.reply('Je moet wel in een spraakkanaal zitten!');
    return;
  }

  voiceChannel.join().then((connection) => {
    const stream = ytdl('https://youtu.be/f49ELvryhao', { filter: 'audioonly' });
    const dispatcher = connection.playStream(stream);

    dispatcher.on('end', () => voiceChannel.leave());
  });
};

const weer = (argss, message) => {
  const { WEER_API_URL: url } = process.env;
  const locatie = argss[1] !== undefined ? `${argss[0]} ${argss[1]}` : argss[0];
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

module.exports = {
  commandList,
  play,
  cat,
  weer,
  oof,
  nummerfeitje,
};
