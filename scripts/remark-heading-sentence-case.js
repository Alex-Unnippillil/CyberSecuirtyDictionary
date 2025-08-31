const {visit} = require('unist-util-visit');
const {toString} = require('mdast-util-to-string');

module.exports = function remarkHeadingSentenceCase() {
  return (tree, file) => {
    visit(tree, 'heading', node => {
      const text = toString(node);
      if (!text) return;
      const expected = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      if (text !== expected) {
        file.message(`Headings should be in sentence case: \`${expected}\``, node);
      }
    });
  };
};
