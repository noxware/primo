// @ts-check
const Action = require('../objects/Action');
const village = require('../../oldCode/src/game/roles/village');

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
  let correct = false;

  await game.channel.send('Police, open your eyes! Investigate someone!');
  
  const target = await game.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: game.currentPlayer,
    target,
    run: ({target}) => {
      correct = target.role.group === 'assassin';
      return true;
    },
    clear: async ({target}) => correct && await game.channel.send('Well accused')
  });
}

module.exports = {
  displayName: 'Police',
  team: 'village',
  onDead,
  onTurn,
}