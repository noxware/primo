const games = require('../games');

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

 module.exports = {
  name: 'join',
  description: 'Joins the player to the current configured game and gives him an avaiable role.',
  guildOnly: true,
  cooldown: 10,
  execute: /** @type {(message: Message, args: string[]) => any} */ (message, args) => {
    const g = games.obtainGame(/** @type {TextChannel} */ (message.channel));
    g.emit('join_command', g, message, args);
  }
};