const Discord = require('discord.js');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = {
  name: 'cmds',
  run: (message) => {
    const embed = new Discord.RichEmbed().setColor('#FF00FF').setTitle('Overzicht');
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);

      embed.addField(command.usage, command.description);
    }

    message.channel.send(embed);
  },
};
