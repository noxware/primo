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
  let correct = false;

  await gameState.send('Police, open your eyes! Investigate someone!');
  
  const target = await gameState.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: gameState.currentPlayer,
    target,
    run: ({target}) => {
      correct = target.role.group === 'assasin';
      return true;
    },
    clear: ({target}) => correct && gameState.send('Well accused')
  });
}

module.exports = {
  displayName: 'Police',
  onDead,
  onTurn,
}