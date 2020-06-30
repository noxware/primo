// @ts-check

const discord = require('discord.js');
const Player = require('../objects/Player');
const Role = require('../objects/Role');
const roles = require('../roles');

class PlayerCollection {
  /**
   * 
   * @param {Iterable<Player>} [players] 
   */
  constructor(players) {
    this.reset();

    if (players)
      for (const p of players)
        this.add(p);
  }

  /**
   * 
   * @param {Player} player 
   * 
   * @returns {PlayerCollection}
   */
  add(player) {
    const {id, role} = player;
    const roleName = role.name;

    if (this._players.has(id)) return this;

    this._players.set(id, player);

    const playersInRole = this._rolesToPlayers.get(roleName);

    if (!playersInRole)
      this._rolesToPlayers.set(roleName, [player]);
    else
      this._rolesToPlayers.get(roleName).push(player);

    return this;
  }

  /**
   * 
   * @param {string} playerId 
   * 
   * @returns {Player}
   */
  get(playerId) {
    return this._players.get(playerId);
  }

  /**
   * 
   * @param {string} playerId
   * 
   * @returns {boolean}
   */
  remove(playerId) {
    if (!this._players.has(playerId)) return false;

    const roleName = this._players.get(playerId).role.name;
    const filtredArray = this._rolesToPlayers.get(roleName).filter((p) => p.id !== playerId);
    this._rolesToPlayers.set(roleName, filtredArray);

    this._players.delete(playerId);
    
    return true;
  }

  /**
   * 
   * @param {string} playerId 
   * 
   * @returns {boolean}
   */
  has(playerId) {
    return this._players.has(playerId);
  }

  reset() {
    /** @type {discord.Collection<string, Player>} */
    this._players = new discord.Collection();
    /** @type {discord.Collection<string, Player[]>} */
    this._rolesToPlayers = new discord.Collection();
  }

  get size() {
    return this._players.size;
  }

  set size(s) {
    throw new Error(`'size' is a read-only property.` )
  }

  [Symbol.iterator]() {
    return this._players.values();
  }

  /**
   * @returns {Iterable<Player>}
   */
  * inTurnOrder() {
    for (const r of roles.rolesInTurnOrder) {
      console.log(r);
      console.log(this._rolesToPlayers.get(r.name));
      for (const p of this._rolesToPlayers.get(r.name) || []) {
        yield p;
      }
    }
  }

  /**
   * @returns {Iterable<Player>}
   */
  * inActionOrder() {
    for (const r of roles.rolesInActionOrder)
      for (const p of this._rolesToPlayers.get(r.name)  || [])
        yield p;
  }

  filter(fn) {
    return this._players.filter(fn);
  }

  map(fn) {
    return this._players.map(fn);
  }
}

module.exports = PlayerCollection;