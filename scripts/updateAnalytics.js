const fs = require('fs');
const path = require('path');

// Load query log
const logPath = path.join(__dirname, '..', 'data', 'query-log.json');
const termsPath = path.join(__dirname, '..', 'terms.json');
const outPath = path.join(__dirname, '..', 'analytics', 'analytics.json');

function loadJSON(p){
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function ensureDir(p){
  if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true});
}

function levenshtein(a, b){
  const dp = Array.from({length: a.length+1}, () => Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++) dp[i][0] = i;
  for(let j=0;j<=b.length;j++) dp[0][j] = j;
  for(let i=1;i<=a.length;i++){
    for(let j=1;j<=b.length;j++){
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function suggest(query, terms){
  const scores = terms.map(t => ({term: t, score: levenshtein(query.toLowerCase(), t.toLowerCase())}));
  scores.sort((a,b)=>a.score-b.score);
  return scores.slice(0,3).map(s=>s.term);
}

function aggregate(){
  const log = loadJSON(logPath);
  const terms = loadJSON(termsPath).terms.map(t=>t.term || t.name || '');
  const analytics = { generatedAt: new Date().toISOString(), trend: [], queries: [], poorQueries: [] };
  const byDate = {};
  const byQuery = {};

  for(const entry of log){
    const {date, query, impressions, clicks, zeroResults} = entry;
    if(!byDate[date]) byDate[date] = {date, impressions:0, clicks:0, zeroResults:0};
    if(!byQuery[query]) byQuery[query] = {query, impressions:0, clicks:0, zeroResults:0};
    byDate[date].impressions += impressions;
    byDate[date].clicks += clicks;
    byDate[date].zeroResults += zeroResults;
    byQuery[query].impressions += impressions;
    byQuery[query].clicks += clicks;
    byQuery[query].zeroResults += zeroResults;
  }

  analytics.trend = Object.values(byDate)
    .sort((a,b)=>a.date.localeCompare(b.date))
    .map(d=>({date: d.date, impressions: d.impressions, ctr: d.impressions?d.clicks/d.impressions:0, zeroResults: d.zeroResults}));

  analytics.queries = Object.values(byQuery).map(q=>({
    query: q.query,
    impressions: q.impressions,
    clicks: q.clicks,
    zeroResults: q.zeroResults,
    ctr: q.impressions ? q.clicks / q.impressions : 0
  }));

  const poor = analytics.queries
    .filter(q=> q.zeroResults > 0 || q.ctr < 0.1)
    .sort((a,b)=> b.zeroResults - a.zeroResults || a.ctr - b.ctr)
    .slice(0,20)
    .map(q=> ({...q, suggestions: suggest(q.query, terms)}));

  analytics.poorQueries = poor;

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, JSON.stringify(analytics, null, 2));
}

aggregate();
