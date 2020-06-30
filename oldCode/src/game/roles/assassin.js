// @ts-check

const Action = require('../objects/Action');

/**
 * Type imports
 *  
 * @typedef {import('../objects/GameState')} GameState
 * 
*/

async function onDead(gameState) {
  return true;
}

/**
 * 
 * @param {GameState} gameState 
 */
async function onTurn(gameState) {
  await gameState.send('Assassin, open your eyes! Kill someone!');

  const target = await gameState.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: gameState.currentPlayer,
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