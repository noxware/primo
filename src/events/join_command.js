const games = require('../games');
const Player = require('../objects/Player');

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

/**
 * 
 * @param {Message} message 
 */
async function handler(message) {
  const g = games.obtainGame(/** @type {TextChannel} */ (message.channel));

  if (g.state != 'ready') {
    await message.reply(`There is a game in curse so you can't join now.`);
    return;
  }

  if (!g.unusedRoles.size) {
    await message.reply('You can\'t join the game because there are not enough slots/roles for you.');
    return;
  }

  if (g.players.hasKey(message.author.id)) {
    await message.reply('You are already in a game in this channel. Wait until it ends to join a new game.');
    return;
  }

  const player = new Player(message.member, g.unusedRoles.pullRandom(), g);
  g.players.add(player);

  const countPlayers = g.players.size;
  const maxPlayers = g.players.size + g.unusedRoles.size;

  await message.author.send(`Your role is '${player.role.displayName}'.`);
  await message.reply(`I've sent you a DM with your role. (Players ${countPlayers}/${maxPlayers}).`);

  if (countPlayers === maxPlayers) {
    g.emit('game_start', g);
  }
}

module.exports = handler;