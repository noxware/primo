/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game
 */

/**
 * 
 * @param {Game} game 
 */
module.exports = async game => {
  await game.channel.send('Close your eyes! (Not really).');
  game.state = 'night';
  for (const p of game.players)
    if (p.alive)
      await game.emit('turn', game, p);

  game.currentPlayer = undefined;
  game.emit('day', game);
}