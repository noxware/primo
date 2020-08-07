const games = require('../games');

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

 module.exports = {
  name: 'NAME',
  description: 'DESC.',
  guildOnly: true,
  args: true,
  usage: 'USAGE',
  cooldown: 10,
  execute: /** @type {(message: Message, args: string[]) => any} */ (message, args) => {
    const g = games.obtainGame(/** @type {TextChannel} */ (message.channel));
    g.emit('NAME_command', message, args);
  }
};