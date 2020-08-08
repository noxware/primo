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
  /** @type {()=>Promise<boolean>} */
  let onDeadBk;
  let attacked = false;

  await game.channel.send('Healer, open your eyes! Heal someone!');

  const target = await game.currentPlayer.selectTarget();
  if (!target) return;

  return new Action({
    source: game.currentPlayer,
    target,
    run: ({target}) => {  // Los targets pueden ser undefineds
      onDeadBk = target.onDead;
      target.onDead = async () => {
        attacked = true;
        return false;
      };

      return true;
    },

    clear: async ({target}) => {
      if (attacked) await game.channel.send('Well healed.');

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