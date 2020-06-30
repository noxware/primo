// @ts-check

/**
 * @typedef {import('./GameState')} GameState
 */

/**
 * @callback onTurnCallback
 * @param {GameState} gameState
 */

/**
 * @callback onDeadCallback
 * @param {GameState} gameState
 */

class Role {
  /**
   * 
   * @param {Object} p
   * @param {string} p.name
   * @param {string} p.group
   * @param {string} p.team
   * @param {string} p.displayName
   * @param {number} p.min
   * @param {onTurnCallback} p.onTurn
   * @param {onDeadCallback} p.onDead 
   */
  constructor({name, group, team, displayName, min, onTurn, onDead}) {
    this.name = name;
    this.group = group;
    this.team = team;
    this.displayName = displayName;
    this.min = min;
    this.onTurn = onTurn;
    this.onDead = onDead;
  }
}

module.exports = Role;