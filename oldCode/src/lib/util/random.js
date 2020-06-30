// @ts-check

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
 * Returns a random item from an array and removes it.
 * 
 * @param {any[]} array 
 * @return {any}
 */
function pullRandom(array) {
  if (!Array.isArray(array) || !array.length) return;

  const randomIndex = randomBetween(0, array.length - 1);
  return array.splice(randomIndex, 1)[0];
}

module.exports = {
  randomBetween,
  pullRandom
}