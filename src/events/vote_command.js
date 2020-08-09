

/**
 * Type imports.
 * 
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../objects/Game')} Game
 * 
 */

/**
 * 
 * @param {Game} game
 * @param {Message} message
 * @param {string[]} args 
 */
async function handler(game, message, args) {
  if (game.state !== 'day') {
    message.reply('The game is not in the day phase.');
    return;
  }

  if (!game.players.hasKey(message.member.id)) {
    message.reply(`You are not in the game. You can't vote.`);
    return;
  }

  if (game.voted.hasKey(message.member.id)) {
    message.reply(`You can't vote again.`);
    return;
  }

  const source = game.players.key(message.member.id);
  let target = null; // null if nobody, undefined if reference lost

  if (args[0] !== 'nobody') {
    target = message.mentions.members.first();

    if (!target) {
      message.reply(`Invalid vote command. Please mention someone using the mention feature (example uwu vote @playerName) or vote 'nobody'.`);
      return;
    }

    const {id} = target;

    if (game.votes.has(id)) {
      game.votes.set(id, game.votes.get(id) + 1);
    } else {
      game.votes.set(id, 1);
    }
  }

  game.voted.add(source);
  message.reply('Vote recived successfully.');

  await game.emit('vote', game, source, target); // dead

  // TODO OPTI
  if (game.voted.size >= game.players.count(p => p.alive))
    game.emit('votation_end', game);
}

module.exports = handler;
