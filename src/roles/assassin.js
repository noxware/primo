// @ts-check

const Action = require('../objects/Action');

/**
 * Type imports
 *  
 * @typedef {import('../objects/Game')} Game
 * 
*/

/**
 * 
 * @param {Game} game
 */
async function onDead(game) {
  return true;
}

/**
 * 
 * @param {Game} game
 */
async function onTurn(game) {
  await game.channel.send('Assassin, open your eyes! Kill someone!');

  const target = await game.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: game.currentPlayer,
    target,
    run: ({target}) => target.kill()
  });
}


module.exports = {
  displayName: 'Assassin',
  group: 'assassin',
  team: 'mafia',
  onDead,
  onTurn,
}