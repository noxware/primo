const fs = require('fs');
const CustomEmitter = require('./lib/CustomEmitter');

const EVENTS_FOLDER = './events';

/** @type {{name: string, callback: (...args: any[]) => any}[]} */
const events = [];

const eventsFiles = fs.readdirSync(EVENTS_FOLDER).filter(file => file.endsWith('.js'));
for (const file of eventsFiles) {
  const name = file.replace(/\.js$/, '');
  events.push({name, callback: require(`${EVENTS_FOLDER}/${name}`)});
}

/**
 * 
 * @param {CustomEmitter} emitter 
 */
exports.loadIntoEmitter = function (emitter) {
 for (const e of events) {
  emitter.on(e.name, e.callback);
 }
}

