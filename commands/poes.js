const fetch = require('node-fetch');

module.exports = {
  name: 'poes',
  usage: '!poes',
  description: 'Cute',
  run: (message) => {
    fetch('http://aws.random.cat/meow')
      .then(res => res.json())
      .then(body => message.channel.send(body.file))
      .catch(err => console.log(err));
  },
};
