const discord = require('discord.js');
const ReadOnlyError = require('../errors/readonly');

/**
 * Type imports.
 * 
 * @typedef {import('./Game')} Game
 * @typedef {import('./Role')} Role
 * @typedef {import('./Action')} Action
 */

/**
 * Represents a player in a game.
 */
class Player  {
  /**
   * 
   * @param {discord.User} user 
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
   * @returns {boolean}
   */
  kill() {
    this._alive = this.onDead();

    if (!this._alive) this.game.emit('kill', [this]);

    return this._alive;
  }

  /**
   * Method called when the player is going to be killed. Returning false will cancel the kill, returning true will confirme it.
   * 
   * @returns {boolean}
   */
  onDead() {
    if (this.role.onDead)
      return Boolean(this.role.onDead(this.game));

    return true;
  }

  /**
   * Method called on the player's turn.
   * 
   * @returns {Action | undefined}
   */
  onTurn() {
    if (this.role.onTurn)
      return this.role.onTurn(this.game);
  }

  /**
   * Sends a DM to the player.
   * 
   * @param {string | string []} msg 
   */
  async send(msg) {
    await this.guildMember.send(msg);
  }


}

module.exports = Player;