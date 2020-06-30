const db = require('./lib/database');
const orderedRoles = require('./roles-order.json');

function loadRoles() {
  orderedRoles.forEach((roleName, index) => {
    const role = require(`./roles/${roleName}`);
    role.name = roleName; // Added property
    role.index = index; // Added propety

    db.db.roles.set(roleName, role);
  });
}

module.exports = {
  loadRoles
}