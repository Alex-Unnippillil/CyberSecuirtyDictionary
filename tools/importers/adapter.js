// Adapter interface for transforming external data into internal term format.
// An adapter implements a `parse` method which accepts a string of source
// content and returns an array of terms in the internal format:
// { term: string, definition: string, tags: string[] }
class Adapter {
  /**
   * Convert raw content into an array of terms.
   * @param {string} content - Raw file contents.
   * @returns {Array<{term: string, definition: string, tags: string[]}>}
   */
  parse(content) {
    throw new Error('parse() must be implemented by subclasses');
  }
}

module.exports = { Adapter };
