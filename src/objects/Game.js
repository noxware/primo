const discord = require('discord.js');
const EventCenter = require('events').EventEmitter;

/**
 * Stores a game data.
 */
class Game extends EventCenter {
  /**
   * 
   * @param {discord.TextChannel} channel 
   */
  constructor(channel) {
    super();

    this.channel = channel;
    this.id = channel.id;

    this.reset();
  }
}

module.exports = Game;