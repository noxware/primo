/**
 * 
 * @param {Set<(...args:any)=>any>} fns
 * @param {...any} args
 */
function *iterateWhileRunning(fns, ...args) {
  for (const f of fns) {
    yield f(...args);
  }
}

/**
 * A custom and simple emitter with an awaitable emit function.
 */
class CustomEmitter {
  constructor() {
    /** @type {Map<string | symbol, Set<(...args:any)=>any>>} */
    this.events = new Map();
  }

  /**
   * 
   * @param {string | symbol} eventName 
   * @param  {(...args:any)=>any} listener 
   */
  on(eventName, listener) {
    let listeners = this.events.get(eventName);

    if (!listeners) {
      listeners = new Set();
      this.events.set(eventName, listeners);
    }

    listeners.add(listener);
  }

  /**
   * 
   * @param {string | symbol} eventName 
   * @param  {...any} args 
   */
  async emit(eventName, ...args) {
    if (this.events.has(eventName))
      return Promise.all(iterateWhileRunning(this.events.get(eventName), ...args));
  }

  reset() {
    this.events.clear();
  }
}

module.exports = CustomEmitter;