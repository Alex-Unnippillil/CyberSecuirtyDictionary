const { Adapter } = require('./adapter');
const yaml = require('js-yaml');

// YAML adapter: expects a list of objects with term, definition, and tags.
class YAMLAdapter extends Adapter {
  parse(content) {
    const data = yaml.load(content);
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

module.exports = { YAMLAdapter };
