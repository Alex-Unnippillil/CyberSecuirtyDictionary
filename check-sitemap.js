const fs = require('fs');

async function main() {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const failures = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status !== 200) {
        console.error(`${url} -> ${res.status}`);
        failures.push(url);
      } else {
        console.log(`${url} -> ${res.status}`);
      }
    } catch (err) {
      console.error(`${url} -> ${err.message}`);
      failures.push(url);
    }
  }
  if (failures.length) {
    console.error(`Found ${failures.length} failing URLs`);
    process.exit(1);
  }
}

main();
