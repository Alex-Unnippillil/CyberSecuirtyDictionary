const { Adapter } = require('./adapter');

// JSON adapter: expects an array of objects with term, definition, and tags.
class JSONAdapter extends Adapter {
  parse(content) {
    const data = JSON.parse(content);
    if (!Array.isArray(data)) return [];
    return data
      .filter(item => item.term && item.definition)
      .map(item => ({
        term: String(item.term),
        definition: String(item.definition),
        tags: Array.isArray(item.tags)
          ? item.tags.map(t => String(t))
          : [],
      }));
  }
}

module.exports = { JSONAdapter };
