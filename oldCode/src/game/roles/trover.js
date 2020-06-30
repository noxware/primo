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
  let onDeadBk;
  let attacked = false;

  await gameState.send('Trover, open your eyes! Silence someone!');

  const target = await gameState.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: gameState.currentPlayer,
    target,
    run: ({target}) => {  // Los targets pueden ser undefineds
      for (const a of gameState.actions) {
        if (a.target === target)
          a.run = undefined;
          a.clear = undefined;
      }
      
      return true;
    },
  });
}

module.exports = {
  displayName: 'Trover',
  team: 'village',
  onDead,
  onTurn,
}