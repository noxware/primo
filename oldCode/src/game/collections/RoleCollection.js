// @ts-check

const discord = require('discord.js');
const Role = require('../objects/Role');
const random = require('../../lib/util/random');

class RoleCollection {
  /**
   * 
   * @param {Iterable<Role>} [roles] 
   */
  constructor(roles) {
    this.reset();

    if (roles)
      for (const r of roles)
        this.add(r);
  }

  /**
   * 
   * @param {Role} role 
   * 
   * @returns {RoleCollection}
   */
  add(role) {
    this._collection.set(role.name, role);
    return this;
  }

  /**
   * 
   * @param {string} roleName 
   * 
   * @returns {Role}
   */
  get(roleName) {
    return this._collection.get(roleName);
  }

  /**
   * 
   * @param {string} roleName
   * 
   * @returns {boolean}
   */
  remove(roleName) {
    return this._collection.delete(roleName);
  }

  /**
   * 
   * @param {string} roleName 
   * 
   * @returns {boolean}
   */
  has(roleName) {
    return this._collection.has(roleName);
  }

  reset() {
    /** @type {discord.Collection<string, Role>} */
    this._collection = new discord.Collection();
  }

  get size() {
    return this._collection.size;
  }

  set size(s) {
    throw new Error(`'size' is a read-only property.` )
  }

  /**
   * @returns {Iterator<Role>}
   */
  [Symbol.iterator]() {
    return this._collection.values();
  }

  pullRandom() {
    let i=0;
    const randint = random.randomBetween(i, this.size - 1)

    for (const r of this) {
      if (i === randint) {
        this.remove(r.name);
        return r;
      }
      
      i++;
    }   
  }

  /**
   * 
   * @param {string[]} roleNames 
   * @param {RoleCollection} rolesDb 
   * 
   * @returns {RoleCollection | string} - incorrect rn
   */
  static fromRoleNames(roleNames, rolesDb) {
    const res = new RoleCollection();

    for (const rn of roleNames) {
      if (rolesDb.has(rn))
        res.add(rolesDb.get(rn));
      else
        return rn;
    }

    return res;
  }

  /**
   * Takes a list of roles as a parameter and returns a new RoleCollection with those roles ordered as they apear in this RoleCollection.
   * 
   * The parameter can also be a list of string names.
   * 
   * @param {IterableIterator<Role> | IterableIterator <string> | Iterable<Role> | Iterable<string>} roleList - RoleCollection or any iterable role list or name list.
   * 
   * @returns {RoleCollection}
   */
  applyOrder(roleList) {
    const orderedRoles = new RoleCollection();

    /* Easy algoritm for RoleCollections. */
    if(roleList instanceof RoleCollection) {
      for (const r1 of this)
          if (roleList.has(r1.name))
            orderedRoles.add(r1);
    
    /* Alternative algorithm for any iterable object. */
    } else {
      for (const r1 of this) {
        let exists = false;
        for (const r2 of roleList) {
          // @ts-ignore
          exists = exists || r1.name === r2.name || r1.name === r2;
        }

        if (exists) orderedRoles.add(r1);
      }
    }

    return orderedRoles;
  }
}

module.exports = RoleCollection;