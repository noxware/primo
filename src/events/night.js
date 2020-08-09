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

  for (const a of game.actions.inActionOrder) {
    await game.emit('action', game, a);
  }

  for (const a of game.actions.inActionOrder) {
    await game.emit('clear', game, a);
  }

  game.currentPlayer = undefined;
  game.emit('day', game);
}