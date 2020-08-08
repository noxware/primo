/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game
 * @typedef {import('../objects/Player')} Player
 */

/**
 * 
 * @param {Game} game 
 * @param {Player} player
 */
module.exports = async (game, player) => {
  game.nightDayKills.add(player);
}