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

const embed = (summonerName, match, matchInfo) => new Discord.RichEmbed()
  .setColor('#1d2439')
  .setTitle(gameTypes[match.queue])
// .setAuthor(summonerName)
  .addField('Champion', `${match.champion}`)
  .addField('Result', `${matchInfo}`)
  .setTimestamp(match.timestamp);

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
    const summonerName = args[0];
    const accountId = await getAccountId(summonerName);
    const match = await getMatchInfo(accountId);
    const result = await parseMatchData(match);
    const matchInfo = await getMatchResult(result.gameId, accountId);
    message.channel.send(embed(summonerName, result, matchInfo));
  },
};

const getAccountId = async (userName) => {
  let data;
  try {
    data = await api
      .get('euw1', 'summoner.getBySummonerName', userName)
      .catch(error => console.error(error));
  } catch (error) {
    console.error(error);
  }
  console.log(`${data.name}'s summoner id is ${data.accountId}.`);

  return data.accountId;
};

const getMatchInfo = async (accountId) => {
  try {
    const data = await api.get('euw1', 'match.getMatchlist', accountId);
    return data.matches;
  } catch (error) {
    console.error(error);
  }
};

const getMatchResult = async (gameId, accountId) => {
  const gameData = await api.get('euw1', 'match.getMatch', gameId);

  const participantId = gameData.participantIdentities.find(
    participantIdentities => participantIdentities.player.accountId === accountId,
  ).participantId;
  const teamId = gameData.participants.find(participant => participant.participantId === 7).teamId;
  const result = gameData.teams.find(team => team.teamId === teamId).win;
  return result === 'Fail' ? 'Lost' : result;
};

const parseMatchData = async (matchData) => {
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
