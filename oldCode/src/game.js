// @ts-check

// set current player and other helper states?

async function startGame(game) {
  const channel = game.channel();

  await channel.send('The game is going to start! Close your eyes! (not really).');

  /* Night phase */

  for (const player of game.alivePlayersInRoleOrder()) {
    game.setCurrentPlayer(player);
    game.pushAction(await player.onTurn(game));
  }

  game.runActionsBackwards();
  game.runClears();
  
  for (const p of game.getKillHistory()) {
    channel.send(`${p.user.username} died.`)
  }

  game.runOks();
  game.runFails();

  game.changePhase();
}

module.exports = {
  startGame
}