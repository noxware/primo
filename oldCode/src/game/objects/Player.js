// @ts-check

const discord = require('discord.js');
const Role = require('./Role');

const PLAYER_WAIT = 1000 * 60 * 30;

/**
 * @typedef {import('./GameState')} GameState
 */

class Player {
  /**
   * @param {discord.User | discord.GuildMember} user 
   * @param {Role} role
   * @param {GameState} gameState
   */
  constructor(user, role, gameState) {
    this.guildMember = gameState.channel.guild.member(user);
    this.displayName = this.guildMember.displayName;
    this.gameState = gameState;
    this.role = role;

    this._alive = true;
  }

  /**
   * @returns {boolean}
   */
  get alive() {
    return this._alive;
  }

  set alive(x) {
    throw new Error(`'alive' is a read-only property.`);
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.guildMember.id;
  }

  set id(x) {
    throw new Error(`'id' is a read-only property.`);
  }

  /**
   * @returns {boolean}
   */
  kill() {
    this._alive = this.onDead();

    if (!this._alive) this.gameState.kills.add(this);

    return this._alive;
  } 
  
  /**
   * @returns {boolean}
   */
  onDead() {
    if (this.role.onDead)
      return Boolean(this.role.onDead(this.gameState));

    return true;
  }

  onTurn() {
    if (this.role.onTurn)
      return this.role.onTurn(this.gameState);
  }

  async send(msg) {
    this.guildMember.send(msg);
  }

  /**
   * 
   * @param {string | string[]} textMsg 
   * @param {(text: string) => boolean} textFilter 
   */
  async ask(textMsg, textFilter) {
    const dmChannel = await this.guildMember.createDM();
    dmChannel.send(textMsg);

    return new Promise((resolve, reject) => {
      /**
       * Auto ignore non playerid and just provide the message text
       * 
       * @param {discord.Message} msg 
       */
      const capsuleFilter = msg => {
        if (msg.author.id === this.id)
          return Boolean(textFilter(msg.content));
      };

      const gsCollectors = this.gameState.collectors;
      const collector = dmChannel.createMessageCollector(capsuleFilter, {time: PLAYER_WAIT, max: 1});
      gsCollectors.set(this.id, collector);

      collector.on('end', collected => {
        if (gsCollectors.has(this.id)) gsCollectors.delete(this.id);

        if(collected.size === 0) {
          // TODO: Handle kick by timeout
          reject();
        } else {
          resolve(collected.first().content);
        }
      });
    });
  }

  /*async choose() {}
  async select() {}*/

  /**
   * 
   * @param {string[]} [exceptionsIds]
   * @param {boolean} [allowNull=true]
   * @param {string} [customText]
   * 
   * @returns {Promise<Player | undefined>}
   */
  async selectTarget(exceptionsIds, allowNull, customText) {
    if (allowNull === undefined) allowNull = true;

    const players = Array.from(this.gameState.players.filter(p => !(exceptionsIds && exceptionsIds.includes(p.id)) ).values());

    /** @type {string[]} */
    const listOptions = [];
    let i=1;
    for (const p of players.values()) {
      listOptions.push(`${i} - ${p.displayName}`);
      i++;
    }
      


    if (allowNull) listOptions.push('x - Skip');

    let option; // modified insted of returning to save converting two times
    await this.ask([(customText || 'Select your target'), '', ...listOptions], text => {
      console.log(text);
      const p = players[Number(text) - 1];
      console.log(Number(text) - 1);
      console.log(p);


      if (!p && allowNull && text === 'x') option = 'x';
      else option = p;

      return Boolean(option);
    });

    if (option === 'x') return;
    else return option;
  }
}

module.exports = Player;