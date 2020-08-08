// @ts-check


/**
 * 
 * @param {import('../objects/Game')} game 
 */
async function onDead(game) {
  return true;
}

module.exports = {
  displayName: 'Village',
  team: 'village',
  onDead
}