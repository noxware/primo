const roles = require('../roles');
const RoleCollection = require('../collections/RoleCollection');
const games = require('../games');

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

const MIN_PLAYERS = 3;

/**
 * 
 * @param {Message} message 
 * @param {string[]} roleNames 
 */
async function handler(message, roleNames) {
  const game = games.obtainGame(/** @type {TextChannel} */ (message.channel));
  if (game.state != 'ready') {
    await message.reply(`You can't change roles when there is a game in curse.`);
    return;
  }

  if (roleNames.length < MIN_PLAYERS) {
    await message.reply(`You need at least ${MIN_PLAYERS} roles to play.`);
    return;
  }

  const rc = roles.rolesInTurnOrder.intersection(roleNames);

  if (rc.size < roleNames.length) {
    await message.reply(`Invalid role ${rc.}.`);
    return;
  }

  let assasinGroup = 0;
  let assasinTeam = 0;
  /*let villageTeam = false;*/
  let otherTeams = 0;

  for (const r of rc) {
    if (r.group === 'assassin') assasinGroup++;
    if (r.team === 'mafia') assasinTeam++;
    /*villageTeam = villageTeam || r.team === 'village';*/
    if(r.team === undefined || r.team === 'village') otherTeams++;
  }

  if (!assasinGroup) {
    await message.reply(`There is no main assasin (for example the Assasin role).`);
    return;
  }

  if (otherTeams < 2) {
    await message.reply(`There is only ${otherTeams} players that are not from the assasin team.`);
    return;
  }

  gameState.reset();

  gameState.unusedRoles = rc;

  await message.channel.send('The game has been configured successfully with the specified roles.');
}

module.exports = handler;