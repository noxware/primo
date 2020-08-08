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
  /** @type [string | null, number] */
  let mostVoted = [null, 0];
  /** @type [string | null, number] */
  let secondMostVoted = [null, 0];

  for (const [id, votes] of game.votes) {
    if(mostVoted[1] <= votes) { // <= is important
      secondMostVoted = mostVoted;
      mostVoted = [id, votes];
    }
  }

  // players / 2?
  if (mostVoted[1] <= game.players.size / 2) {
    await game.channel.send('The votation ended with not enough votes to kill someone. You must have more than the half of players to kill someone.');
  } else {
    if (mostVoted[1] === secondMostVoted[1]) {
      await game.channel.send('The votation ended in a draw. Nobody died.')
    } else {
      const died = await game.players.key(mostVoted[0]).kill();

      if (died) {
        await game.channel.send(`'${game.players.key(mostVoted[0]).displayName}' has been ejecuted by the village.`);
      }
      else
        await game.channel.send(`${game.players.key(mostVoted[0]).displayName} should die but the player is inmortal. (bug?)`);
    }
  }

  await game.emit('win_check', game);
  game.emit('night', game)
}