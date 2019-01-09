const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'weer',
  usage: '!weer <stad>',
  description: 'Toont het huidige weer in de opgegeven stad.',
  run: (message, args) => {
    const { WEER_API_URL: url } = process.env;
    const locatie = args.join(' ');
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
};
