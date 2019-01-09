const Discord = require('discord.js');
const TeemoJS = require('teemojs');
const championData = require('../champion.json');

const api = TeemoJS(process.env.RIOT_API_KEY);

const embed = match => new Discord.RichEmbed()
  .setColor('#1d2439')
  .setTitle(match.word)
  .addField('Definitie', `${match.definition}`)
  .addField('Voorbeeld', `${match.example}`)
  .addField('Link', `${match.permalink}`)
  .setTimestamp();

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
    const match = await getMatchData(accountId);
    const result = await parseMatchData(match);
    message.channel.send(embed(result));
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
  console.log(`${data.name}'s summoner id is ${data.id}.`);

  return data.accountId;
};

const getMatchData = async (accountId) => {
  try {
    const data = await api.get('euw1', 'match.getMatchlist', accountId);
    console.log(data.matches.slice(Math.min(data.matches.length - 1, 1)));

    return data.matches.slice(Math.min(data.matches.length - 1, 1));
  } catch (error) {
    console.error(error);
  }
};

const parseMatchData = async (matchData) => {
  matchData = Object.keys(matchData)
    .map(k => matchData[k])
    .reverse();

  const matchResult = [];

  for (const property in matchData) {
    const match = matchData[property];
    match.timestamp = new Date(match.timestamp);
    match.champion = championIds[match.champion];
    matchResult.push(match);
  }

  return matchResult;
};
