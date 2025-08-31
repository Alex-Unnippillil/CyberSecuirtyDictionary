const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Graph = require('graphology');
const betweennessCentrality = require('graphology-metrics/centrality/betweenness');

// Load terms from YAML
const dataPath = path.join(__dirname, 'data', 'terms.yaml');
const terms = yaml.load(fs.readFileSync(dataPath, 'utf8'));

// Helper to create URL friendly slugs
function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Index terms by slug for quick lookup
const termsMap = {};
for (const term of terms) {
  const slug = term.slug || slugify(term.name);
  termsMap[slug] = term;
}

// Prepare graph and adjacency data structures
const graph = new Graph({type: 'undirected'});
const adjacency = {};
Object.keys(termsMap).forEach(slug => {
  graph.addNode(slug);
  adjacency[slug] = {related: [], synonyms: [], prerequisites: []};
});

const edges = [];
const edgeSet = new Set();

function addEdge(source, target, type) {
  const key = [source, target].sort().join('|');
  if (edgeSet.has(key)) return;
  edgeSet.add(key);
  graph.addUndirectedEdge(source, target, {type});
  edges.push({source, target, type});
}

// Build adjacency lists and graph edges
for (const term of terms) {
  const slug = term.slug || slugify(term.name);
  const related = term.related || term.see_also || [];
  const synonyms = term.synonyms || [];
  const prerequisites = term.prerequisites || [];

  for (const ref of related) {
    const refSlug = slugify(ref);
    if (!termsMap[refSlug]) {
      console.warn(`Missing term referenced in related: ${ref}`);
      continue;
    }
    adjacency[slug].related.push(refSlug);
    addEdge(slug, refSlug, 'related');
  }

  for (const ref of synonyms) {
    const refSlug = slugify(ref);
    if (!termsMap[refSlug]) {
      console.warn(`Missing term referenced in synonyms: ${ref}`);
      continue;
    }
    adjacency[slug].synonyms.push(refSlug);
    addEdge(slug, refSlug, 'synonym');
  }

  for (const ref of prerequisites) {
    const refSlug = slugify(ref);
    if (!termsMap[refSlug]) {
      console.warn(`Missing term referenced in prerequisites: ${ref}`);
      continue;
    }
    adjacency[slug].prerequisites.push(refSlug);
    addEdge(slug, refSlug, 'prerequisite');
  }
}

// Verify edges reference existing terms
for (const {source, target} of edges) {
  if (!termsMap[source] || !termsMap[target]) {
    throw new Error(`Edge references missing term: ${source} - ${target}`);
  }
}

// Compute centrality metrics
const betweenness = betweennessCentrality(graph, {normalized: true});

const nodeCount = graph.order;
const graphData = {
  nodes: Object.keys(adjacency).map(slug => {
    const degree = graph.degree(slug);
    const degreeCentrality = nodeCount > 1 ? degree / (nodeCount - 1) : 0;
    return {
      id: slug,
      related: adjacency[slug].related,
      synonyms: adjacency[slug].synonyms,
      prerequisites: adjacency[slug].prerequisites,
      degree: degreeCentrality,
      betweenness: betweenness[slug] || 0
    };
  }),
  edges
};

fs.writeFileSync(
  path.join(__dirname, 'graph.json'),
  JSON.stringify(graphData, null, 2)
);

console.log('graph.json generated with', graph.order, 'nodes and', graph.size, 'edges');

