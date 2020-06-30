// @ts-check

const handler = require('../game/command-handlers/join');

module.exports = {
  name: 'join',
  description: 'Joins the player to the current configured game and gives him an avaiable role.',
  guildOnly: true,
  cooldown: 10,
  execute: handler
};