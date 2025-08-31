const fs = require('fs');
const yaml = require('js-yaml');
const { exec } = require('child_process');

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const status = await new Promise((resolve, reject) => {
        exec(
          `curl -I -L -A \"Mozilla/5.0\" --max-time 10 -o /dev/null -s -w \"%{http_code}\" ${url}`,
          (err, stdout) => {
            if (err) {
              reject(err);
            } else {
              resolve(stdout.trim());
            }
          }
        );
      });
      if (status === '200') {
        return true;
      }
      throw new Error(`Status ${status}`);
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function main() {
  const file = fs.readFileSync('data/terms.yaml', 'utf8');
  const terms = yaml.load(file);
  const urls = new Set();

  if (Array.isArray(terms)) {
    for (const term of terms) {
      if (Array.isArray(term.sources)) {
        for (const url of term.sources) {
          urls.add(url);
        }
      }
    }
  }

  // allow extra URLs via CLI args for testing
  for (const arg of process.argv.slice(2)) {
    urls.add(arg);
  }

  let allOk = true;
  for (const url of urls) {
    try {
      await fetchWithRetry(url);
      console.log(`✔️  ${url}`);
    } catch (err) {
      console.error(`❌ ${url}: ${err.message}`);
      allOk = false;
    }
  }

  if (!allOk) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
