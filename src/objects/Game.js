

const discord = require('discord.js');
const CustomEmitter = require('../lib/CustomEmitter');

const PlayerCollection = require('../collections/PlayerCollection');
const RoleCollection = require('../collections/RoleCollection');
const ActionColletion = require('../collections/ActionCollection');
const Action = require('../../oldCode/src/game/objects/Action');

const fs = require('fs');
const Player = require('./Player');
const { loadIntoEmitter } = require('../events');

/**
 * Stores the game data and is the event emmiter for every stage in the game.
 */
class Game extends CustomEmitter {
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

    this.state = 'ready';
    /** @type {Player} */
    this.currentPlayer = undefined;

    this.voted = new PlayerCollection();
    /** @type {Map<string, number>} */
    this.votes = new Map();
    this.nightDayKills = new PlayerCollection();

    loadIntoEmitter(this);
  }

  /**
   * Resets the game
   */
  reset() {
    this.players.reset();
    this.unusedRoles.reset();
    this.actions.reset();

    this.state = 'ready';

    this.voted.reset();
    this.votes.clear();

    this.nightDayKills.reset();

    super.reset();

    loadIntoEmitter(this);
  }
}

module.exports = Game;