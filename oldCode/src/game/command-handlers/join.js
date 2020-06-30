// @ts-check

const discord = require('discord.js');

const {obtainGameState} = require('../gameStates');
const Player = require('../objects/Player');
const gameStates = require('../gameStates');
const game = require('../game');

/**
 * 
 * @param {discord.Message} message 
 */
async function handler(message) {
  const gs = obtainGameState(message.channel);

  if (gs.state != 'ready') {
    await message.reply(`There is a game in curse so you can't join now.`);
    return;
  }

  if (!gs.unusedRoles.size) {
    await message.reply('You can\'t join the game because there are not enough slots/roles for you.');
    return;
  }

  if (gs.players.has(message.author.id)) {
    await message.reply('You are already in a game in this channel. Wait until it ends to join a new game.');
    return;
  }

  const player = new Player(message.member, gs.unusedRoles.pullRandom(), gs);
  gs.players.add(player);

  const countPlayers = gs.players.size;
  const maxPlayers = gs.players.size + gs.unusedRoles.size;

  await message.author.send(`Your role is '${player.role.displayName}'.`);
  await message.reply(`I've sent you a DM with your role. (Players ${countPlayers}/${maxPlayers}).`);

  if (countPlayers === maxPlayers) {
    game(gs);
  }
}

module.exports = handler;