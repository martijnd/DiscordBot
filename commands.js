require('dotenv').config();

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

let args;

const commands = {
  play: {
    description: 'Speel een liedje van Youtube.',
    run: (message) => {
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
    },
  },
  cat: {
    description: 'Cute',
    run: (message) => {
      fetch('http://aws.random.cat/meow')
        .then(res => res.json())
        .then(body => message.channel.send(body.file))
        .catch(err => console.log(err));
    },
  },
  oof: {
    description: 'oof',
    run: (message) => {
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
    },
  },
  weer: {
    description: 'Toont het huidige weer in de opgegeven stad.',
    run: (message, argss) => {
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
    },
  },
  nummerfeitje: {
    description: 'Willekeurig feitje over het opgegeven nummer.',
    run: (message, argss) => {
      const url = `http://numbersapi.com/${argss[0]}`;
      fetch(url)
        .then(res => res.text())
        .then(body => message.channel.send(body));
    },
  },
};

const commandList = (message) => {
  const embed = new Discord.RichEmbed()
    .setColor('#FF00FF')
    .setTitle('Overzicht')
    .addField('!play <Youtube-URL>', commands.play.description)
    .addField('!oof', commands.oof.description)
    .addField('!weer <Stad>', commands.weer.description)
    .addField('!poes', commands.cat.description)
    .addField('!nummerfeitje <nummer>', commands.nummerfeitje.description);
  message.channel.send(embed);
};

module.exports = {
  commands,
  commandList,
};
