const Discord = require('discord.js');
const fetch = require('node-fetch');

const isNumber = num => Number.isNaN(num);
const randomInt = max => Math.floor(Math.random() * Math.floor(max));

module.exports = {
  name: 'xkcd',
  usage: '!xkcd <nummer>',
  description: 'xkcd comics',
  run: async (message, args) => {
    let comicNr;

    if (args[0] && isNumber(args[0])) {
      console.log(isNumber(args[0]));

      let xkcdMax;
      await fetch('https://xkcd.com/info.0.json')
        .then(res => res.json())
        .then((body) => {
          xkcdMax = body.num;
        });
      [comicNr] = args;
      if (comicNr > xkcdMax || comicNr < 1) return message.channel.send(`Kies een getal tussen 1 en ${xkcdMax}`);
    } else comicNr = randomInt(2000);

    await fetch(`https://xkcd.com/${comicNr}/info.0.json`)
      .then(res => res.json())
      .then((body) => {
        const embed = new Discord.RichEmbed()
          .setTitle(`xkcd #${comicNr}`)
          .setColor('#ffffff')
          .setImage(body.img)
          .setFooter(body.alt);
        message.channel.send(embed);
      })
      .catch(error => console.log(error));
    return 0;
  },
};
