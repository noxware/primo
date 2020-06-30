// @ts-check

const handler = require('../game/command-handlers/roles');

//async function execute(message, args) {}

module.exports = {
  name: 'roles',
  description: 'Sets the roles that are going to be used for a game in this channel.',
  guildOnly: true,
  args: true,
  usage: '<role_1> <role_2> <role_3> ... <role_n>',
  cooldown: 10,
  execute: handler
};