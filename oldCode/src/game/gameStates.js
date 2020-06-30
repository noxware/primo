// @ts-check

const GameStateCollection = require('./collections/GameStateCollection');
const GameState = require('./objects/GameState');

const gameStates = new GameStateCollection();

function obtainGameState(channel) {
  let gs = gameStates.get(channel.id);

  if (!gs) {
    gs = new GameState(channel);
    gameStates.add(gs);
  }

  return gs;
}

module.exports = {
  gameStates,
  obtainGameState
}