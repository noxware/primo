const BpCollection = require('../lib/BpCollection');
const Game = require('../objects/Game');

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

/**
 * A collection specialized in storing games.
 * 
 * @extends {BpCollection<string, Game>}
 */
class GameCollection extends BpCollection {
  constructor() {
    super({
      keyExtractor: /** @type {(g: Game) => string} */ (g => g.id)
    });
  }

  /**
   * Returns the game if exists, otherwise creates a new one.
   * 
   * @param {TextChannel} channel
   * @returns {Game}
   */
  obtainGame(channel) {
    let game = this.key(channel.id);

    if (!game) {
      game = new Game(channel);
      this.add(game);
    }

    return game;
  }
}

module.exports = GameCollection;