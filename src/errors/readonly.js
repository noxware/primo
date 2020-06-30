/**
 * Error thrown when trying to modify a read-only property.
 */
class ReadOnlyError extends Error {
  /**
   * 
   * @param {string | undefined} propName - Name of the property.
   * @param {string} [customMsg] - Message shown if propName is undefined.
   */
  constructor(propName, customMsg) {
    if (propName)
      super(`'${propName}' is a read-only property.`);
    else if (customMsg)
      super(customMsg);

    this.name = this.constructor.name;
    //Error.captureStackTrace(this, ReadOnlyError)
  }
}

module.exports = ReadOnlyError;