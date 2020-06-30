// @ts-check

const handler = require('../game/command-handlers/vote');

module.exports = {
  name: 'vote',
  description: 'Votes during day to kill someone.',
  guildOnly: true,
  cooldown: 10,
  execute: handler
};