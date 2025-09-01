const handler = require('./og-card');

function runTest() {
  let body = '';
  const res = {
    setHeader: () => {},
    end: chunk => {
      if (chunk) body += chunk;
    },
  };

  handler({ params: { slug: 'cve' } }, res);

  if (!body.includes('CVE') || !body.includes('Vulnerability Tracking')) {
    throw new Error('OG card did not render term title and tags');
  }
  console.log('OG card route test passed');
}

runTest();
