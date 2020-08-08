const discord = require('discord.js');
const ReadOnlyError = require('../errors/readonly');

/**
 * Type imports.
 * 
 * @typedef {import('./Game')} Game
 * @typedef {import('./Role')} Role
 * @typedef {import('./Action')} Action
 */

const PLAYER_WAIT = 1000 * 60 * 30;

/**
 * Represents a player in a game.
 */
class Player  {
  /**
   * 
   * @param {discord.User | discord.GuildMember} user 
   * @param {Role} role 
   * @param {Game} game 
   */
  constructor(user, role, game) {
    this.guildMember = game.channel.guild.member(user);
    this.displayName = this.guildMember.displayName;
    this.game = game;
    this.role = role;

    this._alive = true;
  }

  //// Getters and setters ////

  /**
   * Get if the player is alive.
   * 
   * @returns {boolean}
   */
  get alive() {
    return this._alive;
  }

  set alive(a) {
    throw new ReadOnlyError('alive');
  }

  /**
   * Returns the id of the player.
   * 
   * @returns {string}
   */
  get id() {
    return this.guildMember.id;
  }

  set id(x) {
    throw new ReadOnlyError('id');
  }

  /**
   * Kills the player. Returns if the player actually died or not.
   * 
   * @returns {Promise<boolean>}
   */
  async kill() {
    this._alive = await this.onDead();

    if (!this._alive) await this.game.emit('kill', this.game, this);

    return this._alive;
  }

  /**
   * Method called when the player is going to be killed. Returning false will cancel the kill, returning true will confirme it.
   * 
   * @returns {Promise<boolean>}
   */
  async onDead() {
    if (this.role.onDead)
      return Boolean(await this.role.onDead(this.game));

    return true;
  }

  /**
   * Method called on the player's turn.
   * 
   * @returns {Promise<Action | undefined>}
   */
  async onTurn() {
    if (this.role.onTurn)
      return await this.role.onTurn(this.game);
  }

  /**
   * Sends a DM to the player.
   * 
   * @param {string | string []} msg 
   */
  async send(msg) {
    await this.guildMember.send(msg);
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

      // MOD
      const collector = dmChannel.createMessageCollector(capsuleFilter, {time: PLAYER_WAIT, max: 1});

      collector.on('end', collected => {
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

    //const players = Array.from(this.gameState.players.filter(p => !(exceptionsIds && exceptionsIds.includes(p.id)) ).values());
    const players = this.game.players.filterToArray(p => !(exceptionsIds && exceptionsIds.includes(p.id)) );
      
    const listOptions = players.map((p, i)=> `${i+1} - ${p.displayName}`);

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