const httpServer = require('http-server');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

(async () => {
  const server = httpServer.createServer({ root: '.' });
  const PORT = 8080;
  await new Promise(resolve => server.listen(PORT, resolve));

  const pages = ['index.html', 'search.html'];
  let hasErrors = false;

  for (const page of pages) {
    const url = `http://localhost:${PORT}/${page}`;
    console.log(`\nTesting ${url}`);

    const pa11yResults = await pa11y(url, {
      chromeLaunchConfig: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    if (pa11yResults.issues.length) {
      hasErrors = true;
      console.log('pa11y violations:');
      pa11yResults.issues.forEach(issue => {
        console.log(`- ${issue.message} (${issue.selector})`);
      });
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const pageObj = await browser.newPage();
    await pageObj.goto(url);
    const axeResults = await new AxePuppeteer(pageObj).analyze();
    if (axeResults.violations.length) {
      hasErrors = true;
      console.log('axe violations:');
      axeResults.violations.forEach(v => {
        v.nodes.forEach(node => {
          console.log(`- ${v.id}: ${node.target.join(' ')}`);
        });
      });
    }
    await browser.close();
  }

  server.close();

  if (hasErrors) {
    console.error('Accessibility violations found');
    process.exit(1);
  } else {
    console.log('No accessibility violations found');
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
