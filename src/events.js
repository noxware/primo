const fs = require('fs');
const { EventEmitter } = require('events');

const EVENTS_FOLDER = './events';

/** @type {{name: string, callback: (...args: any[]) => any}[]} */
const events = [];

const eventsFiles = fs.readdirSync(EVENTS_FOLDER).filter(file => file.endsWith('.js'));
for (const file of eventsFiles) {
  events.push(require(`${EVENTS_FOLDER}/${file}`));
}

/**
 * 
 * @param {EventEmitter} emitter 
 */
exports.loadIntoEmitter = function (emitter) {
 for (const e of events) {
  emitter.on(e.name, e.callback);
 }
}

