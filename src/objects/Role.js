/**
 * Type imports.
 * 
 * @typedef {import('./Game')} Game
 * @typedef {import('./Action')} Action
 */

/**
 * @callback onTurnCallback
 * @param {Game} game
 * 
 * @returns {Action}
 */

/**
 *  @callback onDeadCallback
 *  @param {Game} game
 * 
 *  @returns {boolean}
 */

/**
 * Valid role object.
 * 
 * @typedef {Object} RoleObject
 * @property {string} name
 * @property {string} displayName
 * @property {string} [group]
 * @property {string} team
 * @property {onTurnCallback} [onTurn]
 * @property {onDeadCallback} [onDead]
 */

 /**
  * Represents a role.
  */
class Role {
  /**
   * @param {RoleObject} r 
   */
  constructor(r) {
    this.name = r.name;
    this.displayName = r.displayName;
    this.group = r.group;
    this.team = r.team;
    this.onTurn = r.onTurn;
    this.onDead = r.onDead;
  }
}

module.exports = Role;