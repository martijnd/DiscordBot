const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'urban',
  usage: '!urban <woord>',
  description: 'Geeft de definitie van het opgegeven woord.',
  run: (message, args) => {
    const { URBAN_API_URL: url } = process.env;
    const term = args[0] ? args[0] : 'test';
    const embed = response => new Discord.RichEmbed()
      .setColor('#1d2439')
      .setTitle(response.word)
      .addField('Definitie', `${response.definition}`)
      .addField('Voorbeeld', `${response.example}`)
      .addField('Link', `${response.permalink}`)
      .setTimestamp();

    fetch(url + term)
      .then(res => res.json())
      .then((body) => {
        const response = body.list[0];
        message.channel.send(embed(response));
      })
      .catch(err => console.log(err));
  },
};
