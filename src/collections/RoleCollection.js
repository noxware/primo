const BpCollection = require('../lib/BpCollection');
const { Role } = require('discord.js');

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
  
}

module.exports = RoleCollection;