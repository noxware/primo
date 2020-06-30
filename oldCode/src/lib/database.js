// @ts-check

const random = require('./util/random');
const iter = require('./util/iterator');
const func = require('./util/function');


/**
 * @typedef {import('discord.js').Channel} Channel
 * @typedef {import('discord.js').User} User
 */

/**
 * @typedef {Object} Role
 * @property {string} name
 * @property {string} displayName
 * @property {number} min
 * @property {string} alternative
 * @property {function() : undefined} [onSelect]
 * @property {function() : undefined} [onDead]
 * @property {function() : undefined} [onTurn]
 */

// An awesome db
const db = {
  games: new Map(),
  roles: new Map()
}

class Player {
  constructor(user, role) {
    this.user = user;
    //this.playerId = player.id;
    this.role = role;
    this.alive = true;
  }

  onTurn(game) {
    return func.unsureCall(this.role.onTurn, game);
  }

  onDead(game) {
    return func.unsureCall(this.role.onDead, game);
  }
}

class Action {
  constructor({source, target, action, ok, fail}) {
    this.source = source;
    this.target = target;
    this.action = action;
    this.ok = ok;
    this.fail = fail;
  }
}

/*class RoleSlot {
  constructor() {
    this.players = [];
    this.actions = [];
  }
}*/

// all indexable as maps?

class GameData {
  constructor(channel) {
    this.channel = channel;
    this.lang = 'en';
    this.unusedRoles = [];
    this.players = new Map();
    this.roles = new Map();
    this.actions = [];
    this.currentPlayer = undefined;
    this.turn = 0;
    this.killHistory = []
    this.night = true;

    this.oks = [];
    this.fails = [];
    this.clears = [];
    //this.toKill = new Set();
  }
}

class Game {
  constructor(channel) {
    this._data = db.games.get(channel.id);

    if (!this._data) {
      this._data = new GameData(channel);
      db.games.set(channel.id, this._data);
    }

    // ...
  }

  resetData() {
    if(this._data) {
      this._data = new GameData(this._data.channel);
      db.games.set(this._data.channel.id, this._data);
    }
  }

  setUnusedRoles(roleNames) {
    if (roleNames.length < 2) // 3
      return '@any';

    const limits = new Map();
    let assasinGroup = false;

    for (const rn of roleNames) {
      const roleObj = db.roles.get(rn);
      if (!roleObj) return rn;

      assasinGroup = assasinGroup || roleObj.group;

      if (roleObj.min) {
        let roleLimit = limits.get(rn);

        if (!roleLimit) {
          roleLimit = {min: roleObj.min, count: 1};
          limits.set(rn, roleLimit);
        }
        else
          roleLimit.count++;
      }
    }

    if (!assasinGroup) return '@assasin'; // group assasin

    for (let [roleName, roleLimit] of limits)
      if (roleLimit.count < roleLimit.min)
        return `#${roleName}`
  
    this.resetData();
    const { unusedRoles, roles } = this._data;
  
    for (const r of db.roles.values()) {
      if (roleNames.includes(r.name)) {
        unusedRoles.push(r);
        roles.set(r.name, []);
      }
    }
  }

  countUnusedRoles() {
    return this._data.unusedRoles.length;
  }

  countPlayers() {
    return this._data.players.size;
  }

  isPlayer(userId) {
    return this._data.players.has(userId);
  }

  joinPlayer(user) {
    const { unusedRoles, roles, players } = this._data;

    if (!unusedRoles.length || this.isPlayer(user.id)) return;
  
    const randomRole = random.pullRandom(unusedRoles);
    const player = new Player(user, randomRole);

    players.set(user.id, player);
    roles.get(randomRole.name).push(player);
  
    return randomRole;
  }

  player(playerId) {
    return this._data.players.get(playerId);
  }

  players() {

    return this._data.players.values();
  }

  * alivePlayers() {
    for (const p of this.players())
      if (p.alive) yield p;
  }

  * playersInRoleOrder() {
    for (const pa of this._data.roles.values())
      for (const p of pa)
        yield p;
  }

  * alivePlayersInRoleOrder() {
    for (const p of this.playersInRoleOrder())
      if (p.alive) yield p;
  }

  killPlayer(player) {
    console.log('PLAYER KILLPLAYER')
      console.log(player);
    if (!player.alive) return true; // or false?

    let died;

    died = player.onDead();
    if (!died) return false;

    /*died = player.role.onDead();
    if (!died) return false;*/

    player.alive = false;
    this._data.killHistory.push(player);

    return true;
  }

  channel() {
    return this._data.channel;
  }

  currentPlayer() {
    return this._data.currentPlayer;
  }

  setCurrentPlayer(player) {
    this._data.currentPlayer = player;
  }

  incrementTurn() { // night?
    this._data.turn++;
  }

  pushAction(action) {
    if (!action) return;

    action = new Action(action); // OPTI: check instanceof before
    this._data.actions.push(action);
  }

  getActions() {
    return this._data.actions;
  }

  clearActions() {
    this._data.actions = [];
  }
//fast
  runActionsBackwards() {
    for (const a of iter.reverseArray(this.getActions())) {
      //const result = func.unsureCall(a.action, a);
      console.log('ACTION RUNBACKWARDS')
      console.log(a);
      const result = a.action(a);
      if (result) {
        if (result instanceof Function) this._data.clears.push(result);
        if (a.ok instanceof Function) this._data.oks.push(a.ok);
      } else {
        if (a.fail instanceof Function) this._data.fails.push(a.fail);
      }
    }
  }

  runFails() {
    for(const f of this._data.fails)
      func.unsureCall(f.fail, f);
  }

  runOks() {
    for(const o of this._data.oks)
      func.unsureCall(o.ok, o);
  }

  runClears() {
    for(const c of this._data.clears)
      c();
  }

  getKillHistory() {
    return this._data.killHistory;
  }
//
  clearKillHistory() {
    this._data.killHistory = [];
  }

  changePhase() {
    this.clearActions();
    this.clearKillHistory();
    this._data.night = !this._data.night;
  }

  /*setKill(player) {
    this._data.toKill.add(player);
  }*/

  /*toKill() {
    return this._data.toKill;
  }*/
}

function getGame(channel) {
  return new Game(channel);
}

module.exports = {
  getGame,
  Action,
  db
}