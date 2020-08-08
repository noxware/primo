/**
 * Type imports.
 * 
 * @typedef {import('../objects/Game')} Game
 */

 /**
  * 
  * @param {Game} game 
  */
 module.exports = async game => {
  await game.channel.send('Open your eyes!');
  game.state = 'day';
  for (const p of game.nightDayKills)
    await game.channel.send(`'${p.displayName}' died.`);

  await game.emit('win_check', game);

  game.nightDayKills.reset();
}