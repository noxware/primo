// @ts-check

const RoleCollection = require('./collections/RoleCollection');
const Role = require('./objects/Role');

const rolesInTurnOrder = new RoleCollection();
const rolesInActionOrder = new RoleCollection();

require('./roles-turn-order').forEach((roleName, index) => {
  const role = require(`./roles/${roleName}`);
  role.name = roleName; // Added property
  role.index = index; // Added propety

  rolesInTurnOrder.add(new Role(role));
});

require('./roles-action-order').forEach((roleName, index) => {
  const role = require(`./roles/${roleName}`);
  role.name = roleName; // Added property
  role.index = index; // Added propety

  rolesInActionOrder.add(new Role(role));
});

module.exports = {
  rolesInTurnOrder,
  rolesInActionOrder
}