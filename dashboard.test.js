const fs = require('fs');
const { JSDOM } = require('jsdom');

(async () => {
  const html = fs.readFileSync('dashboard.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com' });

  const counts = JSON.parse(fs.readFileSync('counts.json', 'utf8'));

  dom.window.fetch = () => Promise.resolve({ json: () => counts });

  const charts = [];
  dom.window.Chart = function(ctx, config) {
    charts.push(config);
    return {};
  };

  const script = fs.readFileSync('assets/js/dashboard.js', 'utf8');
  dom.window.eval(script);

  await dom.window.renderCharts();

  const [domainCfg, difficultyCfg, frameworkCfg] = charts;

  if (JSON.stringify(domainCfg.data.labels) !== JSON.stringify(Object.keys(counts.byDomain))) {
    console.error('Domain chart labels mismatch');
    process.exit(1);
  }
  if (JSON.stringify(domainCfg.data.datasets[0].data) !== JSON.stringify(Object.values(counts.byDomain))) {
    console.error('Domain chart data mismatch');
    process.exit(1);
  }

  if (JSON.stringify(difficultyCfg.data.labels) !== JSON.stringify(Object.keys(counts.byDifficulty))) {
    console.error('Difficulty chart labels mismatch');
    process.exit(1);
  }
  if (JSON.stringify(difficultyCfg.data.datasets[0].data) !== JSON.stringify(Object.values(counts.byDifficulty))) {
    console.error('Difficulty chart data mismatch');
    process.exit(1);
  }

  if (JSON.stringify(frameworkCfg.data.labels) !== JSON.stringify(Object.keys(counts.byFramework))) {
    console.error('Framework chart labels mismatch');
    process.exit(1);
  }
  if (JSON.stringify(frameworkCfg.data.datasets[0].data) !== JSON.stringify(Object.values(counts.byFramework))) {
    console.error('Framework chart data mismatch');
    process.exit(1);
  }

  console.log('Dashboard charts test passed');
})();
