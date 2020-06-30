// @ts-check

const discord = require('discord.js');
const {obtainGameState} = require('../gameStates');

/**
 * 
 * @param {discord.Message} message 
 * @param {string[]} args 
 */
function handler(message, args) {
  const gs = obtainGameState(message.channel);

  if (!gs.votePhase) {
    message.reply('The game is not in the votation phase.');
    return;
  }

  if (!gs.players.has(message.member.id)) {
    message.reply(`You are not in the game. You can't vote.`);
    return;
  }

  if (gs.voted.has(message.member.id)) {
    message.reply(`You can't vote again.`);
    return;
  }

  if (args[0] !== 'nobody') {
    const guildMember = message.mentions.members.first();

    if (!guildMember) {
      message.reply(`Invalid vote command. Please mention someone using the mention feature (example uwu vote @playerName) or vote 'nobody'.`);
      return;
    }

    const {id} = guildMember;

    if (gs.votes.has(id)) {
      gs.votes.set(id, gs.votes.get(id) + 1);
    } else {
      gs.votes.set(id, 1);
    }
  }

  gs.voted.add(message.member.id);
  message.reply('Vote recived successfully.');

  if (gs.voted.size === gs.players.size)
    gs.voteResolve();
}

module.exports = handler;