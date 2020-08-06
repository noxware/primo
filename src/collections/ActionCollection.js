const BpCollection = require('../lib/BpCollection');
const roles = require('../roles');

/**
 * Type imports.
 * 
 * @typedef {import('../objects/Action')} Action
 * @typedef {import('../objects/Player')} Player
 */

/**
 * A collection specialized in storing actions. Doesn't inherit from BpCollection.
 * 
 * Changing the source of an action will break everything here.
 */
class ActionCollection {
  constructor() {
    /** @type {Map<string, Action[]>} */
    this._rolesToActions = new Map();

    /** @type {Map<string, Action[]>} */
    this._sourceToActions = new Map();
  }

  //// MUTATION ////

  /**
   * Reset/clear the collection.
   */
  reset() {
    this._rolesToActions.clear();
    this._sourceToActions.clear();
  }

  /**
   * Add an Action.
   * Returns the collection.
   * 
   * @param {Action} action 
   * @returns {ActionCollection}
   */
  add(action) {
    const roleName = action.source.role.name;
    const sourceId = action.source.id 

    let rta = this._rolesToActions.get(roleName);
    let sta = this._sourceToActions.get(sourceId);

    if (!rta /* && !sta */) {
      /** @type {Action[]} */
      const rta2 = [];
      /** @type {Action[]} */
      const sta2 = [];

      this._rolesToActions.set(roleName, rta2);
      this._sourceToActions.set(sourceId, sta2);

      rta = rta2;
      sta = sta2;
    }

    rta.push(action);
    sta.push(action);

    return this;
  }

  //// QUERY ////

  /**
   * Returns a list of actions by the role's name of the source.
   * 
   * @param {string} name 
   * @returns {Action[] | undefined}
   */
  getByRoleName(name) {
    return this._rolesToActions.get(name);
  }

  /**
   * Returns a list of actions by the source's id.
   * 
   * @param {string} id 
   * @returns {Action[] | undefined}
   */
  getBySourceId(id) {
    return this._sourceToActions.get(id);
  }

  //// ITERATION ////

  * _inActionOrder() {
    for (const r of roles.rolesInActionOrder)
      for (const a of this._rolesToActions.get(r.name)  || [])
          yield a;
  }

  * _inTurnOrder() {
    for (const r of roles.rolesInTurnOrder)
      for (const a of this._rolesToActions.get(r.name)  || [])
          yield a;
  }

  /**
   * @returns {Iterable<Action>}
   */
  get inActionOrder() {
    return this._inActionOrder();
  }

  /**
   * @returns {Iterable<Action>}
   */
  get inTurnOrder() {
    return this._inTurnOrder();
  }

  //// ACTION THINGS ////

  /**
   * Run all actions in action order.
   */
  run() {
    for (const a of this.inActionOrder)
      if (a.run) a.run(); // Internally cals run(this)
  }

  /**
   * Clear all actions in action order.
   */
  clear() {
    for (const a of this.inActionOrder)
      if (a.clear) a.clear(); // Internally cals clear(this)
  }
}

module.exports = ActionCollection;