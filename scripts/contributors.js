const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

function avatarUrl(email) {
  const ghMatch = email.match(/^.+?\+?([A-Za-z0-9-]+)@users\.noreply\.github\.com$/);
  if (ghMatch) {
    const username = ghMatch[1];
    return `https://github.com/${username}.png?size=64`;
  }
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=64&d=identicon`;
}

const lines = execSync('git log --format="%aN;%aE"').toString().trim().split('\n');
const map = new Map();
for (const line of lines) {
  if (!line) continue;
  const [name, email] = line.split(';');
  const key = email.toLowerCase();
  const info = map.get(key) || { name, email, commits: 0 };
  info.commits++;
  map.set(key, info);
}

const contributors = Array.from(map.values()).sort((a, b) => b.commits - a.commits);
const items = contributors
  .map(c => `<li><img src="${avatarUrl(c.email)}" alt="${c.name}" width="64" height="64"> ${c.name} - ${c.commits} commits</li>`)
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Contributors</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<main class="container">
<h1>Contributors</h1>
<ul>
${items}
</ul>
</main>
</body>
</html>`;

fs.writeFileSync('contributors.html', html);
console.log('Generated contributors.html');
