

const roles = require('../roles');

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../objects/Game')} Game
 */

const MIN_PLAYERS = 3;

/**
 * 
 * @param {Game} game
 * @param {Message} message 
 * @param {string[]} roleNames 
 */
async function handler(game, message, roleNames) {
  if (game.state != 'ready') {
    await message.reply(`You can't change roles when there is a game in curse.`);
    return;
  }

  if (roleNames.length < MIN_PLAYERS) {
    await message.reply(`You need at least ${MIN_PLAYERS} roles to play.`);
    return;
  }

  const invalidRoles = roles.rolesInTurnOrder.checkKeys(roleNames);

  if (invalidRoles.length > 0) {
    await message.reply(`Invalid roles ${invalidRoles.map(r => `'${r}'`).join(', ')}.`);
    return;
  }

  const rc = roles.rolesInTurnOrder.intersection(roleNames);

  let assasinGroup = 0;
  let mafiaTeam = 0;
  /*let villageTeam = false;*/
  let otherTeams = 0;

  for (const r of rc) {
    if (r.group === 'assassin') assasinGroup++;
    if (r.team === 'mafia') mafiaTeam++;
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

  game.reset();

  game.unusedRoles = rc;

  await message.channel.send('The game has been configured successfully with the specified roles.');

  game.emit('roles', game, message, roleNames);
}

module.exports = handler;