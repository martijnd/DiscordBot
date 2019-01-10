const Discord = require('discord.js');
const TeemoJS = require('teemojs');
const championData = require('../champion.json');

const api = TeemoJS(process.env.RIOT_API_KEY);
const gameTypes = {
  400: 'Normal Draft Pick',
  420: 'Ranked Solo',
  430: 'Normal Blind Pick',
  440: 'Ranked Flex',
  450: 'ARAM',
};

const embed = data => new Discord.RichEmbed()
  .setColor(data.color)
  .setTitle(data.type)
// .setAuthor(summonerName)
  .setThumbnail(data.image)
  .addField('Duration', `${data.duration}`)
  .addField('Champion', `${data.parsed.champion}`)
  .addField('K/D/A', `${data.stats.kills} /  ${data.stats.deaths} / ${data.stats.assists}`)
  .addField('Result', `${data.result}`)
  .setTimestamp(data.parsed.timestamp);

const championIds = [];

Object.keys(championData.data)
  .map(k => championData.data[k])
  .map(el => (championIds[el.key] = el.name));

module.exports = {
  name: 'lastgame',
  usage: '!lastgame <account>',
  description: 'Geeft de definitie van het opgegeven woord.',
  run: async (message, args) => {
    if (!args[0]) {
      message.channel.send('Vul een summoner name in.');
    }
    const summonerName = args.join('');
    const accountId = await getAccountId(summonerName);
    const matchInfo = await getMatchInfo(accountId);
    const gameType = getGameType(matchInfo);
    const parsedMatchData = getParsedMatchData(matchInfo);
    const championImageUrl = getChampionImageUrl(parsedMatchData.champion);
    const matchData = await getMatchData(parsedMatchData.gameId);
    const gameDuration = getGameDuration(matchData);
    const participantId = getParticipantId(accountId, matchData);
    const teamId = getTeamId(participantId, matchData);
    const matchResult = getMatchResult(teamId, matchData);
    const matchStats = getMatchStats(participantId, matchData);
    const color = getRichEmbedColor(matchResult);
    const data = {
      info: matchInfo,
      parsed: parsedMatchData,
      result: matchResult,
      stats: matchStats,
      type: gameType,
      duration: gameDuration,
      image: championImageUrl,
      color,
    };

    console.log(data.image);

    message.channel.send(embed(data));
  },
};

const getAccountId = async (userName) => {
  const data = await api.get('euw1', 'summoner.getBySummonerName', userName);
  return data.accountId;
};

const getMatchInfo = async (accountId) => {
  const data = await api.get('euw1', 'match.getMatchlist', accountId);
  return data.matches;
};

const getGameType = matchInfo => gameTypes[matchInfo[0].queue];

const getMatchData = async gameId => await api.get('euw1', 'match.getMatch', gameId);

const getGameDuration = gameData => `${
  Math.floor(gameData.gameDuration / 60) < 10
    ? `0${Math.floor(gameData.gameDuration / 60)}`
    : Math.floor(gameData.gameDuration / 60)
}:${
  gameData.gameDuration % 60 < 10 ? `0${gameData.gameDuration % 60}` : gameData.gameDuration % 60
}`;

const getChampionImageUrl = champName => `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${champName
  .replace(/'/, '')
  .capitalize()}.png`;

const getParticipantId = (accountId, matchData) => matchData.participantIdentities.find(
  participantIdentities => participantIdentities.player.accountId === accountId,
).participantId;

const getTeamId = (participantId, matchData) => matchData.participants.find(participant => participant.participantId === participantId).teamId;

const getMatchResult = (teamId, matchData) => {
  const result = matchData.teams.find(team => team.teamId === teamId).win;
  return result === 'Fail' ? 'Lost' : result;
};

const getMatchStats = (participantId, matchData) => matchData.participants.find(participant => participant.participantId === participantId).stats;

const getRichEmbedColor = result => (result === 'Lost' ? '#ab000d' : '#00701a');

const getParsedMatchData = (matchData) => {
  matchData = Object.keys(matchData).map(k => matchData[k]);

  const matchResult = [];

  for (const property in matchData) {
    const match = matchData[property];
    match.timestamp = new Date(match.timestamp);
    match.champion = championIds[match.champion];
    matchResult.push(match);
  }

  return matchResult[0];
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
