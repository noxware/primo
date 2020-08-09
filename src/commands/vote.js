const games = require('../games');

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

 module.exports = {
  name: 'vote',
  description: 'Votes during day to kill someone.',
  guildOnly: true,
  cooldown: 10,
  execute: /** @type {(message: Message, args: string[]) => any} */ (message, args) => {
    const g = games.obtainGame(/** @type {TextChannel} */ (message.channel));
    g.emit('vote_command', g, message, args);
  }
};