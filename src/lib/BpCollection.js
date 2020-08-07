/**
 * Returns a random integer number from the [min, max] interval.
 * 
 * @param {number} min
 * @param {number} max
 */
function randomBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Error thrown when trying to modify a read-only property.
 */
class ReadOnlyError extends Error {
  /**
   * 
   * @param {string | undefined} propName - Name of the property.
   * @param {string} [customMsg] - Message shown if propName is undefined.
   */
  constructor(propName, customMsg) {
    if (propName)
      super(`'${propName}' is a read-only property.`);
    else if (customMsg)
      super(customMsg);

    this.name = this.constructor.name;
    //Error.captureStackTrace(this, ReadOnlyError)
  }
}

/**
 * Error thrown when trying to do something that doesn't work with the current configuration.
 */
class IncompatibleConfigurationError extends Error {
  /**
   * @param {string} message - Message to show.
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    //Error.captureStackTrace(this, ReadOnlyError)
  }
}

/**
 * Error thrown when invalid arguments are recived.
 */
class InvalidArgumentsError extends Error {
  /**
   * @param {string} message - Message to show.
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    //Error.captureStackTrace(this, ReadOnlyError)
  }
}

/**
 * Configuration object for BpCollections.
 * 
 * @typedef {Object} BpCollectionConfig
 * @property {(o: any) => any} [keyExtractor]
 */

/** @type {BpCollectionConfig} */
const defaultBulletproofConfig = {
  keyExtractor: undefined,
}

/**
 * OP alternative to Maps.
 * 
 * Has a lot of useful functions and optional mutation events support.
 * 
 * 'undefined' keys are not allowed.
 * 
 * @template K
 * @template V
 */
class BpCollection {
  /**
   * 
   * @param {BpCollectionConfig} [config]
   */
  constructor(config) {
    // Firm
    this.__bulletproof__ = true;

    // Save configuration
    this._keyExtractor = config.keyExtractor;

    //Init things
    this.reset();
  }

  /**
   * Resets the collection clearing it.
   */
  reset() {
    if (this._map)
      this._map.clear();
    else
      /** @type {Map<K, V>} */
      this._map = new Map();
  }

  //// PROPERTY GETTERS AND SETTERS ////

  /**
   * Get the warnings setting.
   * 
   * @returns {boolean}
   */
  get disableWanings() {
    return this._disableWanings;
  }

  /**
   * Set the warnings setting.
   * 
   * @param {boolean} value
   */
  set disableWanings(value) {
    this._disableWanings = Boolean(value);
  }

  /**
   * Get the last accesible index or undefined if the size of the collection is 0.
   * 
   * @readonly
   * @returns {number | undefined}
   */
  get lastIndex() {
    return (this.size === 0) ? undefined : this.size - 1;
  }

  set lastIndex(i) {
    throw new ReadOnlyError('lastIndex');
  }

  /**
   * Get the number of elements in this collection.
   * 
   * @readonly
   * @returns {number}
   */
  get size() {
    return this._map.size;
  }

  set size(s) {
    throw new ReadOnlyError('size');
  }

  /**
   * Returns the first element in the collection.
   * 
   * @returns {V | undefined}
   */
  get first() {
    return this[Symbol.iterator]().next().value;
  }

  set first(f) {
    throw new ReadOnlyError('first');
  }

  /**
   * Returns the last element in the collection.
   * 
   * @returns {V | undefined}
   */
  get last() {
    const { lastIndex } = this;

    if (lastIndex !== undefined)
      return this.index(lastIndex);
  }

  set last(l) {
    throw new ReadOnlyError('last');
  }

  //// BASIC METHODS ////

  /**
   * Adds an element to the collection using the result of the key extractor as a key.
   * 
   * @param {V} value
   * 
   * @returns {BpCollection<K, V>}
   */
  add(value) {
    return this.addCustom(this._keyExtractor(value), value);
  }

  /**
   * Adds an element to the collection using a specific key.
   * 
   * @param {K} key
   * @param {V} value
   * 
   * @returns {BpCollection<K, V>}
   */
  addCustom(key, value) {
    if (key === undefined)
      throw new InvalidArgumentsError(`'undefined' keys are not allowed.`);

    this._map.set(key, value);

    return this;
  }

  /**
   * Returns the element asosiated with the key.
   * 
   * @param {K} k 
   * 
   * @returns {V | undefined}
   */
  key(k) {
    return this._map.get(k);
  }

  /**
   * Returns the element at the index.
   * 
   * @param {number} i 
   * 
   * @returns {V | undefined}
   */
  index(i) {
    let c = 0;

    for (const v of this) {
      if (c === i)
        return v;

      c++;
    }
  }

  /**
   * Get the key of the element at the index i.
   * 
   * @param {number} i 
   * 
   * @returns {K | undefined}
   */
  indexToKey(i) {
    let c = 0;

    for (const k of this.keys) {
      if (c === i)
        return k;

      c++;
    }
  }

  /**
   * Get the index of the element with key k.
   * 
   * @param {K} k 
   * 
   * @returns {number | undefined}
   */
  keyToIndex(k) {
    let c = 0;

    for (const kk of this.keys) {
      if (k === kk)
        return c;

      c++;
    }
  }

  /**
   * Search for an element and return its index.
   * 
   * @param {V} v 
   * 
   * @returns {number | undefined}
   */  
  indexOf(v) {
    let c = 0;

    for (const vv of this) {
      if (v === vv)
        return c;

      c++;
    }
  }

  /**
   * Search for an element and return its key.
   * 
   * @param {V} v
   * 
   * @returns {K | undefined}
   */
  keyOf(v) {
    for (const [kk, vv] of this.keysAndValues)
      if (v === vv)
        return kk;
  }

  /**
   * Returns true if the key exists. Otherwise returns false.
   * 
   * @param {K} k 
   * 
   * @returns {boolean}
   */
  hasKey(k) {
    return this._map.has(k);
  }

  /**
   * Returns true if the index exists. Otherwise returns false.
   * 
   * @param {number} i 
   * 
   * @returns {boolean}
   */
  hasIndex(i) {
    return (i >= 0) && (i < this.size);
  }

  /**
   * Check which keys are not present in the collection.
   * 
   * @param {Iterable<K>} ks 
   * @returns {K[]} - Keys not found.
   */
  checkKeys(ks) {
    /** @type {K[]} */
    const res = []

    for (const k of ks)
      if (!this.hasKey(k))
        res.push(k);

    return res;
  }

  /**
   * Remove the element asociated to the key. Returns the element.
   * 
   * @param {K} k 
   * 
   * @returns {V | undefined}
   */
  removeKey(k) {
    const value = this.key(k)
    const deleted = this._map.delete(k)

    return value;
  }

  /**
   * Remove the element at the index i. Returns the element.
   * 
   * @param {number} i 
   * 
   * @returns {V | undefined}
   */
  removeIndex(i) {
    const key = this.indexToKey(i);
    return this.removeKey(key);
  }

  /**
   * Returns a random key of the collection.
   * 
   * @returns {K | undefined}
   */
  randomKey() {
    if (this.size) {
      return this.indexToKey(randomBetween(0, this.lastIndex));
    }
  }

  /**
   * Returns a random element of the collection.
   * 
   * @returns {V | undefined}
   */
  random() {
    return this.key(this.randomKey());
  }

  /**
   * Deletes a random key from the collection and returns it.
   * 
   * @return {K | undefined}
   */
  pullRandomKey() {
    const randKey = this.randomKey();
    this.removeKey(randKey);
    return randKey;
  }

  /**
   * Removes a random element from the collection and returns it.
   * 
   * @return {V | undefined}
   */
  pullRandom() {
    return this.removeKey(this.randomKey());
  }

  /**
   * Returns a new BpCollection only preserving the keys that appear in the keys iterable.
   * 
   * The resultant BpCollection has the same keyExtractor but no events support.
   * 
   * @param {Iterable<K>} keys 
   * @returns {BpCollection<K, V>}
   */
  intersection(keys) {
    const res = new BpCollection({keyExtractor: this._keyExtractor});

    for (const k of keys) {
      if (this.hasKey(k))
        res.addCustom(k, this.key(k));
    }

    return res;
  }



  /**
   * Returns a new BpCollection preserving the keys/values of both BpCollections.
   * 
   * A Map can be passed as a parameter insted.
   * If both collections has the same key, only the key/value of the second collection will be stored.
   * The resultant BpCollection has the same keyExtractor but no events support.
   * 
   * @param {BpCollection<any, any> | Map<any, any>} col 
   * @returns {BpCollection<any, any>}
   */
  union(col) {
    const res = new BpCollection({keyExtractor: this._keyExtractor});

    this.forEach((v, k) => {
      res.addCustom(k, v);
    });

    col.forEach(/** @type {(v: any, k: any) => void} */ (v, k) => {
      res.addCustom(k, v);
    });

    return res;
  }

  cache() {
    throw new Error(`'cache' is not implemented yet.`);
  }

  lock() {
    throw new Error(`'lock' is not implemented yet.`);
  }

  /**
   * Returns a new object with the keys/values of this collection.
   * 
   * @returns {Object<K, V>}
   */
  toObject() {
    /** @type {Object<K, V>} */
    const res = {};

    this.forEach((value, key) => {
      res[key] = value;
    });

    return res;
  }

  /**
   * Returns a new map with the keys/values of this collection.
   * 
   * @returns {Map<K, V>}
   */
  toMap() {
    /** @type {Map<K, V>} */
    const res = new Map();

    this.forEach((value, key) => {
      res.set(key, value);
    });

    return res;
  }

  //// STATIC ////

  /**
   * Returns a new BpCollection from a Map.
   * 
   * @param {Map<any, any>} map 
   * @param {BpCollectionConfig} [config]
   */
  static fromMap(map, config) {
    const res = new BpCollection(config);
    map.forEach((value, key) => {
      res.addCustom(key, value);
    });

    return res;
  }

  /**
   * Returns a new BpCollection from an Object.
   * 
   * Symbols are ignored. Only properties listed in a for...in are added.
   * 
   * @param {Record<any, any>} obj 
   * @param {BpCollectionConfig} [config]
   */
  static fromObject(obj, config) {
    const res = new BpCollection(config);
    for (const p in obj)
      if (obj.hasOwnProperty(p))
        res.addCustom(p, obj[p]);
    
    return res;
  }

  /**
   * Returns a new BpCollection from an iterable of elements (like an array) with some key property.
   * 
   * The configuration must have a key extractor.
   * 
   * @param {Iterable<any>} arr 
   * @param {BpCollectionConfig} [config]
   */
  static fromIterable(arr, config) {
    if (!config.keyExtractor)
      throw new IncompatibleConfigurationError(`'fromIterable' requires a key extractor.`);

    const res = new BpCollection(config);
    for (const e of arr)
        res.add(e);
    
    return res;
  }

  //// ITERATION UTILS ////

  /**
   * Iterates over the values (and only the values) in this collection.
   * 
   * @returns {Iterator<V>}
   */
  * [Symbol.iterator]() {
    for (const v of this._map.values())
      yield v;
  }

  * _keys() {
    for (const k of this._map.keys())
      yield k;
  }

  /**
   * Returns an interable of keys in this collection.
   * 
   * @returns {Iterable<K>}
   */
  get keys() {
    return this._keys();
  }

  set keys(k) {
    throw new ReadOnlyError('keys');
  }

  * _keysAndValues() {
    for (const kv of this._map)
      yield kv;
  }

  /**
   * Returns an interable of arrays [key, value].
   * 
   * @returns {Iterable<[K, V]>}
   */
  get keysAndValues() {
    return this._keysAndValues();
  }

  set keysAndValues(k) {
    throw new ReadOnlyError('keysAndValues');
  }

  /* Index currentindex, currentkey currentelement when any iter*/

  /**
   * @callback ForEachCallback
   * @param {V} value
   * @param {K} key
   * @param {BpCollection<K, V>} bpc
   */

  /**
   * Iterates over the elements of the collection
   * 
   * @param {ForEachCallback} fn
   * @param {any} [thisArg]
   */
  forEach(fn, thisArg) {
    this._map.forEach((value, key) => {
      fn.call(thisArg, value, key, this);
    });
  }

  /**
   * Evaluates each element of the collection with the function and returns the amount of 'true' returned.
   * 
   * If no function is provided, it will return the size of the collection.
   * 
   * @param {ForEachCallback} fn
   * @param {any} [thisArg]
   * @returns {number}
   */
  count(fn, thisArg) {
    let i = 0;

    if (fn) {
      this.forEach((value, key, bpc) => {
        if (fn.call(thisArg, value, key, bpc))
          i++;
      });
    } else {
      i = this.size;
    }

    return i;
  }

  /**
   * Equivalent to array map but with key as second parameter.
   * 
   * @param {ForEachCallback} fn
   * @param {any} [thisArg]
   * 
   * @returns {any[]}
   */
  mapToArray(fn, thisArg) {
    /** @type {any[]} */
    const res = [];

    this.forEach((value, key, bpc) => {
      res.push(fn.call(thisArg, value, key, bpc));
    })

    return res;
  }

  /**
   * Similar to filterToArray but returns a minimal BpCollection.
   * 
   * The resultant BpCollection has the same keyExtractor but no events support.
   * 
   * @param {ForEachCallback} fn
   * @param {any} [thisArg]
   * 
   * @returns {BpCollection<K, V>}
   */
  filter(fn, thisArg) {
    /** @type {BpCollection<K, V>} */
    const res = new BpCollection({keyExtractor: this._keyExtractor});

    this.forEach((value, key, bpc) => {
      if (fn.call(thisArg, value, key, bpc))
        res.addCustom(key, value);
    })

    return res;
  }

  /**
   * Equivalent to array filter but with key as second parameter.
   * 
   * @param {ForEachCallback} fn
   * @param {any} [thisArg]
   * 
   * @returns {V[]}
   */
  filterToArray(fn, thisArg) {
    /** @type {V[]} */
    const res = [];

    this.forEach((value, key, bpc) => {
      if (fn.call(thisArg, value, key, bpc))
        res.push(value);
    })

    return res;
  }

  //// Events ////

  // wait(condFunction) TODO
}

module.exports = BpCollection;