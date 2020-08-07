const fs = require('fs');

// Test for .js and .json and get name without extension
const supportedFiles = /(.*)\.js(?:on)?$/i;

/**
 * @param {string} dirName 
 */
function loadDir(dirName) {
  const dir = fs.readdirSync(dirName, {withFileTypes: true});

  /** 
   * I can't find how to make recursive type definitions with jsdoc/ts. TODO.
   * 
   * @type {Record<any, any>}
  */
  const tree = {};

  for (const f of dir) {
    const fnameNoExt = (supportedFiles.exec(f.name) || [])[1];
    if (f.isFile() && fnameNoExt) {
      tree[fnameNoExt] = require(`./${dirName}/${f.name}`);
    }
    else if (f.isDirectory()) {
      tree[f.name] = loadDir(`./${dirName}/${f.name}`);
    }
  }  

  return tree;
}

const tree = loadDir('./strings');

/**
 * @param  {... string | number} route 
 */
module.exports = function (...route) {
  let s = tree;
  for (const r of route) {
    if (typeof s !== 'object')
      break;
    s = s[r];
  }

  if (typeof s !== 'string')
    throw 'String not found.';

  return s;
}

console.log(module.exports('test', 'test2', 'a', 'o', 0));