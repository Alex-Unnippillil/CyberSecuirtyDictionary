const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'search.log');
const date = new Date().toISOString().slice(0, 10);
const summaryFile = path.join(logDir, `summary-${date}.json`);

if (!fs.existsSync(logFile)) {
  console.error('No log file found');
  process.exit(1);
}

const lines = fs.readFileSync(logFile, 'utf-8').trim().split('\n').filter(Boolean);
const events = lines.map(line => {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}).filter(Boolean).filter(e => e.timestamp && e.timestamp.startsWith(date));

const stats = {};
for (const e of events) {
  const q = e.query;
  stats[q] = stats[q] || { searches: 0, bestRank: Infinity };
  if (e.type === 'search') stats[q].searches++;
  if (e.type === 'click') stats[q].bestRank = Math.min(stats[q].bestRank, e.rank);
}

const summary = Object.entries(stats).map(([query, { searches, bestRank }]) => ({
  query,
  searches,
  bestRank: isFinite(bestRank) ? bestRank : null
})).sort((a, b) => {
  const rankA = a.bestRank ?? Infinity;
  const rankB = b.bestRank ?? Infinity;
  return rankB - rankA; // worst first
});

fs.writeFileSync(summaryFile, JSON.stringify({ date, queries: summary }, null, 2));
console.log(`Daily summary written to ${summaryFile}`);
