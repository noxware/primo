/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game
 * @typedef {import('../objects/Player')} Player
 */

/**
 * 
 * @param {Game} game 
 */
module.exports = async game => {
  let mafiaTeam = 0;
  let villageTeam = 0;

  for (const p of game.players) {
    if (p.alive) {
      if (p.role.team === 'mafia')
        mafiaTeam++;
      else if (p.role.team === 'village')
        villageTeam++;
    }
  }

  if (mafiaTeam === 0) {
    await game.channel.send('The village team won.');
    game.reset();
  } else if (villageTeam === 0) {
    await game.channel.send('The mafia team won.');
    game.reset();
  }
}