// @ts-check

function forEach(iterator, callback) {
  let index = 0;
  for (const i of iterator) {
    callback(i, index);
    index++;
  }
}

function map(iterator, callback) {
  let index = 0;
  const array = [];

  for (const i of iterator) {
    array.push(callback(i, index));
    index++;
  }

  return array;
}

function* reverseArray(array) {
  for (let i = array.length - 1; i >= 0; i--)
    yield array[i];
}

module.exports = {
  forEach,
  map,
  reverseArray,
}