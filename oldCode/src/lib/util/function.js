// @ts-check

function tryCall(fn, ...args) {
  try {
    return fn(...args);
  } catch (error) {
    return error;
  }
}

function unsureCall(fn, ...args) {
  if (fn) return fn(...args);
}

module.exports = {
  tryCall,
  unsureCall,
}