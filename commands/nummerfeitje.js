const fetch = require('node-fetch');

module.exports = {
  name: 'nummerfeitje',
  usage: '!nummerfeitje <nummer>',
  description: 'Willekeurig feitje over het opgegeven nummer.',
  run: (message, args) => {
    if (args[0]) {
      const url = `http://numbersapi.com/${args[0]}`;
      fetch(url)
        .then(res => res.text())
        .then(body => message.channel.send(body));
    } else {
      message.channel.send('Je moet wel een nummer meesturen!');
    }
  },
};
