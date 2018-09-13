const ytdl = require('ytdl-core');

module.exports = {
  name: 'oof',
  usage: '!oof',
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
};
