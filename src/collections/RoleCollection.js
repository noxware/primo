const BpCollection = require('../lib/BpCollection');

/**
 * Type imports.
 * 
 * @typedef {import('../objects/Role')} Role
 */

/**
 * A collection specialized in storing roles.
 * 
 * @extends {BpCollection<string, Role>}
 */
class RoleCollection extends BpCollection {
  constructor() {
    super({
      keyExtractor: /** @type {(r: Role) => string} */ (r => r.name)
    });
  }
}

module.exports = RoleCollection;