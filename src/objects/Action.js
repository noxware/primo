/**
 * @typedef {import('./Player')} Player
 */

/**
 * @typedef {Object} ActionObject
 * 
 * @property {Player} source
 * @property {Player} target
 * @property {(thisAction: Action) => void} run
 * @property {(thisAction: Action) => void} [clear]
 */

class Action {
  /**
   * @param {ActionObject} actionObj 
   */
  constructor(actionObj) {
    if (actionObj instanceof Action) return actionObj;

    this.source = actionObj.source;
    this.target = actionObj.target;
    this._run = actionObj.run;
    this._clear = actionObj.clear;
  }

  run() {
    if(this._run)
      return this._run(this);
  }

  clear() {
    if(this._clear)
      return this._clear(this);
  }
}

module.exports = Action;