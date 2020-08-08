/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game 
 */

/**
 * Normally emited from a join command.
 * 
 * @param {Game} game 
 */
module.exports = async game => {
  await game.channel.send('The game is going to start!');
  game.emit('night', game);
}