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

  await gameState.send('Healer, open your eyes! Heal someone!');

  const target = await gameState.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: gameState.currentPlayer,
    target,
    run: ({target}) => {  // Los targets pueden ser undefineds
      onDeadBk = target.onDead;
      target.onDead = () => {
        attacked = true;
        return false;
      };

      return true;
    },

    clear: ({target}) => {
      if (attacked) gameState.channel.send('Well healed.');

      target.onDead = onDeadBk;
    }
  });
}

module.exports = {
  displayName: 'Healer',
  team: 'village',
  onDead,
  onTurn,
}