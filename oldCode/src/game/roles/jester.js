// @ts-check

/**
 * 
 * @param {import("../objects/GameState")} game 
 */
async function onDead(game) {
  if (game.votePhase) {
    game.send('Fatality! Jester wins.');
    game.state = 'ready';
    game.voteResolve();
  }

  return true;
}

module.exports = {
  displayName: 'Jester',
  team: 'jester',
  onDead
}