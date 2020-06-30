// @ts-check

const db = require('../lib/database');
const { startGame } = require('../game');

/**
 * @typedef {import('discord.js').Message} Message
 */

let f;

/**
 * @param {Message} message - Message object.
 */
async function execute(message) {
  message.channel.fe
}

module.exports = {
  name: 'test',
  description: '',
  guildOnly: true,
  cooldown: 10,
  execute
};