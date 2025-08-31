const { Adapter } = require('./adapter');

// CSV adapter: expects header row with columns term,definition,tags.
// Tags are semicolon-separated within the tags column.
class CSVAdapter extends Adapter {
  parse(content) {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const termIndex = headers.indexOf('term');
    const definitionIndex = headers.indexOf('definition');
    const tagsIndex = headers.indexOf('tags');
    const terms = [];
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const cols = line.split(',');
      const term = cols[termIndex] ? cols[termIndex].trim() : '';
      const definition = cols[definitionIndex] ? cols[definitionIndex].trim() : '';
      const tags = cols[tagsIndex]
        ? cols[tagsIndex]
            .split(';')
            .map(t => t.trim())
            .filter(Boolean)
        : [];
      if (term && definition) {
        terms.push({ term, definition, tags });
      }
    }
    return terms;
  }
}

module.exports = { CSVAdapter };
