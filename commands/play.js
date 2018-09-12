const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  usage: '!play <youtube-link>',
  description: 'Speel een liedje van Youtube.',
  run: (message, args) => {
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
};
