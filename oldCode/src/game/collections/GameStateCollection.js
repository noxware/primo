// @ts-check

const discord = require('discord.js');

/** @typedef {import('../objects/GameState')} GameState */

class GameStateCollection {
  /**
   * 
   * @param {Iterable<GameState>} [gameStates] 
   */
  constructor(gameStates) {
    this.reset();

    if (gameStates)
      for (const gs of gameStates)
        this.add(gs);
  }

  /**
   * 
   * @param {GameState} gameState 
   * 
   * @returns {GameStateCollection}
   */
  add(gameState) {
    this._collection.set(gameState.id, gameState);
    return this;
  }

  /**
   * 
   * @param {string} id 
   * 
   * @returns {GameState}
   */
  get(id) {
    return this._collection.get(id);
  }

  /**
   * 
   * @param {string} id
   * 
   * @returns {boolean}
   */
  remove(id) {
    return this._collection.delete(id);
  }

  /**
   * 
   * @param {string} id 
   * 
   * @returns {boolean}
   */
  has(id) {
    return this._collection.has(id);
  }

  reset() {
    /** @type {discord.Collection<string, GameState>} */
    this._collection = new discord.Collection();
  }

  get size() {
    return this._collection.size;
  }

  set size(s) {
    throw new Error(`'size' is a read-only property.` )
  }

  /**
   * @returns {Iterator<GameState>}
   */
  [Symbol.iterator]() {
    return this._collection.values();
  }
}

module.exports = GameStateCollection;