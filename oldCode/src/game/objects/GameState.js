// @ts-check

const PlayerCollection = require('../collections/PlayerCollection');
const RoleCollection = require('../collections/RoleCollection');
const ActionColletion = require('../collections/ActionCollection');
const KillList = require('../collections/KillList');
const Player = require('./Player');
const discord = require('discord.js');


/**
 * @typedef {import('discord.js').TextChannel} TextChannel
 */

module.exports = class GameState {
  /**
   * 
   * @param {TextChannel} channel 
   */
  constructor(channel) {
    this.channel = channel;
    this.id = channel.id;

    this.reset();
  }

  reset() {
    this.players = new PlayerCollection();
    this.unusedRoles = new RoleCollection();
    this.actions = new ActionColletion();
    this.kills = new KillList();
    this.state = 'ready';

    /* Improvised vote things */
    this.votes = new discord.Collection();
    this.voted = new Set();
    this.voteResolve = undefined;
    this.votePhase = false;
    this.votePhaseAgain = false;


    /** @type {Player} */
    this.currentPlayer = undefined;
    this.turn = 1;

    /** @type {discord.Collection<string, discord.Collector>} */
    this.collectors = new discord.Collection(); // Improvised
  }

  async send(msg) {
    await this.channel.send(msg);
  }

  
}