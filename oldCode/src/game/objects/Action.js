// @ts-check

/**
 * @typedef {import('./Player')} Player
 */

/**
 * @callback BooleanActionCallback
 * @param {Action} thisAction
 * @returns {boolean}
 */

 /**
 * @callback StringActionCallback
 * @param {Action} thisAction
 * @returns {string}
 */

 /**
 * @callback VoidActionCallback
 * @param {Action} thisAction
 * @returns {void}
 */

/**
 * @typedef {Object} ActionObject
 * 
 * @property {Player} source
 * @property {Player} target
 * @property {BooleanActionCallback} run
 * @property {StringActionCallback} [ok]
 * @property {StringActionCallback} [fail]
 * @property {VoidActionCallback} [clear]
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
    this._ok = actionObj.ok;
    this._fail = actionObj.fail;
    this._clear = actionObj.clear;
  }

  run() {
    if(this._run)
      return this._run(this);
  }

  ok() {
    if(this._ok)
      return this._ok(this);
  }

  fail() {
    if(this._fail)
      return this._fail(this);
  }

  clear() {
    if(this._clear)
      return this._clear(this);
  }
}

module.exports = Action;