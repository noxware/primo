const BpCollection = require('../lib/BpCollection');
const roles = require('../roles');

/**
 * Type imports.
 * 
 * @typedef {import('../objects/Player')} Player
 */

/**
 * A collection specialized in storing players.
 * 
 * @extends {BpCollection<string, Player>}
 */
class PlayerCollection extends BpCollection {
  constructor() {
    super({
      keyExtractor: /** @type {(p: Player) => string} */ (p => p.id)
    });

    /**
     * Aux to get players by role.
     * 
     * @type {Map<string, Player[]>}
     */
    this._rolesToPlayers = new Map();
  }

  /**
   * Resets the collection.
   */
  reset() {
    super.reset();
    this._rolesToPlayers.clear();
  }

  //// Overrided methods ////

  /**
   * Executed before an 'add' operation.
   * 
   * @param {Player | undefined} player 
   */
  _beforeAdd(player) {
    if (!super.hasKey(player.id)) {
      const roleName = player.role.name;
      const playersInRole = this._rolesToPlayers.get(roleName);
      
      if (!playersInRole)
        this._rolesToPlayers.set(roleName, [player]);
      else
        this._rolesToPlayers.get(roleName).push(player);
    }
  }

  /**
   * Executed after a 'remove operation'.
   * 
   * @param {Player | undefined} player
   */
  _afterRemove(player) {
    if (player) {
      const roleName = player.role.name;
      const filtredArray = this._rolesToPlayers.get(roleName).filter((p) => p.id !== player.id);
      this._rolesToPlayers.set(roleName, filtredArray);
    }
  }

  /** 
   * Overrided 'add' method.
   * 
   * @param {Player} player
   * @returns {PlayerCollection}
   */
  add(player) {
    this._beforeAdd(player);
    super.add(player);
    return this;
  }

  /** 
   * Overrided 'addCustom' method.
   * 
   * @param {string} id
   * @param {Player} player
   * @returns {PlayerCollection}
   */
  addCustom(id, player) {
    this._beforeAdd(player);
    super.addCustom(id, player);
    return this;
  }

  /**
   * Overrided 'removeKey' method.
   * 
   * @param {string} playerId
   * @returns {Player | undefined}
   */
  removeKey(playerId) {
    const player = super.removeKey(playerId);
    this._afterRemove(player);
    return player;
  }

  /**
   * Overrided 'removeIndex' method.
   * 
   * @param {number} i
   * @returns {Player | undefined}
   */
  removeIndex(i) {
    const player = super.removeIndex(i);
    this._afterRemove(player);
    return player;
  }

  //// Custom iteration ////
  
  * _inActionOrder() {
    for (const r of roles.rolesInActionOrder)
      for (const p of this._rolesToPlayers.get(r.name)  || [])
        yield p;
  }

  * _inTurnOrder() {
    for (const r of roles.rolesInTurnOrder)
      for (const p of this._rolesToPlayers.get(r.name)  || [])
        yield p;
  }

  /**
   * @returns {Iterable<Player>}
   */
  get inActionOrder() {
    return this._inActionOrder();
  }

  /**
   * @returns {Iterable<Player>}
   */
  get inTurnOrder() {
    return this._inTurnOrder();
  }
}

module.exports = PlayerCollection;