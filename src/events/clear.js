/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game
 * @typedef {import('../objects/Action')} Action
 */

/**
 * 
 * @param {Game} game 
 * @param {Action} action
 */
module.exports = async (game, action) => {
  if (action.clear) return await action.clear()
}