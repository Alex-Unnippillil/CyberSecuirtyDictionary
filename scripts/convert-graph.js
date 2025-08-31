const fs = require('fs');
const path = require('path');

const graphPath = path.join(__dirname, '..', 'graph.json');
const outDir = path.join(__dirname, '..', 'data');

const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

// Write CSV
const csvLines = ['source,target'];
for (const edge of graph.edges) {
  csvLines.push(`${edge.source},${edge.target}`);
}
fs.writeFileSync(path.join(outDir, 'graph.csv'), csvLines.join('\n'), 'utf8');

// Write GraphML
let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
graphml += '  <graph id="G" edgedefault="directed">\n';
for (const node of graph.nodes) {
  graphml += `    <node id="${node.id}"/>\n`;
}
graph.edges.forEach((edge, idx) => {
  graphml += `    <edge id="e${idx}" source="${edge.source}" target="${edge.target}"/>\n`;
});
graphml += '  </graph>\n';
graphml += '</graphml>\n';

fs.writeFileSync(path.join(outDir, 'graph.graphml'), graphml, 'utf8');
