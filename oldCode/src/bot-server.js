const Discord = require('discord.js');
const { token } = require('./config.json');
const { setupCommands } = require('./commmands-handler');

async function main() {
  const client = new Discord.Client();
  setupCommands(client);

  await client.login(token);

  client.user.setActivity('God of Mafia');
}

main();