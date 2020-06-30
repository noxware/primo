// @ts-check

/* LAZY IMPLEMENTATION */

const discord = require('discord.js');
const roles = require('../roles');
const Action = require('../objects/Action')

class ActionCollection {
  /**
   * 
   * @param {Iterable<Action>} [actions] 
   */
  constructor(actions) {
    this.reset();

    if (actions)
      for (const a of actions)
        this.add(a);
  }

  /**
   * 
   * @param {Action} action 
   * 
   * @returns {ActionCollection}
   */
  add(action) {
    console.log(action.source.role);
    const roleName = action.source.role.name;
    const actionsInRole = this._rolesToActions.get(roleName);

    if (!actionsInRole)
      this._rolesToActions.set(roleName, [action]);
    else
      this._rolesToActions.get(roleName).push(action);

    return this;
  }

/*
  get(playerId) {
    return this._players.get(playerId);
  }


  remove(playerId) {
    if (!this._players.has(playerId)) return false;

    const roleName = this._players.get(playerId).role.name;
    const filtredArray = this._rolesToPlayers.get(roleName).filter((p) => p.id !== playerId);
    this._rolesToPlayers.set(roleName, filtredArray);

    this._players.delete(playerId);
    
    return true;
  }


  has(playerId) {
    return this._players.has(playerId);
  }
*/

  reset() {
    /** @type {discord.Collection<string, Action[]>} */
    this._rolesToActions = new discord.Collection();
  }

  /**
   * @returns {Iterator<Action>}
   */
  * [Symbol.iterator]() {
    for (const r of roles.rolesInActionOrder)
      for (const a of this._rolesToActions.get(r.name) || [])
        yield a;
  }

  /**
   * @returns {Iterator<Action>}
   */
  * inTurnOrder() {
    for (const r of roles.rolesInTurnOrder)
      for (const a of this._rolesToActions.get(r.name) || [])
        yield a;
  }

  run(cb) {
    for (const a of this) {
      a.run();
      if (cb) cb(a);
    }
  }

  ok(cb) {
    for (const a of this) {
      a.ok();
      if (cb) cb(a);
    }
  }

  fail(cb) {
    for (const a of this) {
      a.fail();
      if (cb) cb(a);
    }
  }

  clear(cb) {
    for (const a of this) {
      a.run();
      if (cb) cb(a);
    }
  }

  // TODO: Obj parameter with cbs
  runAll(reset) {
    this.run();
    this.ok();
    this.fail();
    this.clear();

    if (reset || reset === undefined) this.reset();
  }
}

module.exports = ActionCollection;