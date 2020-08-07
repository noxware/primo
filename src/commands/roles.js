const games = require('../games');

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

module.exports = {
  name: 'roles',
  description: 'Sets the roles that are going to be used for a game in this channel.',
  guildOnly: true,
  args: true,
  usage: '<role_1> <role_2> <role_3> ... <role_n>',
  cooldown: 10,
  execute: /** @type {(message: Message, roleNames: string[]) => any} */ (message, roleNames) => {
    const g = games.obtainGame(/** @type {TextChannel} */ (message.channel));
    g.emit('roles_command', message, roleNames);
  }
};