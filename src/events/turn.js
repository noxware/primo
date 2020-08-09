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
  if (player) {
    game.currentPlayer = player;
    const action = await player.onTurn();
    if (action)
      game.actions.add(action);
  }
}