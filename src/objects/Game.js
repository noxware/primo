const discord = require('discord.js');
const { EventEmitter } = require('events');

const PlayerCollection = require('../collections/PlayerCollection');
const RoleCollection = require('../collections/RoleCollection');
const ActionColletion = require('../collections/ActionCollection');
const Action = require('../../oldCode/src/game/objects/Action');

const fs = require('fs');

/**
 * Stores the game data and is the event emmiter for every stage in the game.
 */
class Game extends EventEmitter {
  /**
   * 
   * @param {discord.TextChannel} channel 
   */
  constructor(channel) {
    super();

    this.channel = channel;
    this.id = channel.id;

    this.players = new PlayerCollection();
    this.unusedRoles = new RoleCollection();
    this.actions = new ActionColletion();

    
  }
}

module.exports = Game;