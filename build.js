const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, 'terms.json');
const outputDir = path.join(__dirname, 'terms');
const baseUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary';

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function build() {
  const raw = fs.readFileSync(termsPath, 'utf8');
  const data = JSON.parse(raw);

  fs.mkdirSync(outputDir, { recursive: true });

  const urls = [baseUrl + '/'];

  data.terms.forEach((item) => {
    const slug = slugify(item.term);
    const filePath = path.join(outputDir, slug + '.html');
    const html = '<!DOCTYPE html>\n'
      + '<html lang="en">\n'
      + '<head>\n'
      + '  <meta charset="UTF-8" />\n'
      + '  <title>' + item.term + '</title>\n'
      + '  <link rel="stylesheet" href="../styles.css" />\n'
      + '</head>\n'
      + '<body>\n'
      + '  <div id="definition"></div>\n'
      + '  <script id="term-data" type="application/json">' + JSON.stringify(item) + '</script>\n'
      + '  <script>\n'
      + '    const term = JSON.parse(document.getElementById("term-data").textContent);\n'
      + '    document.getElementById("definition").innerHTML = "<h3>" + term.term + "</h3><p>" + term.definition + "</p>";\n'
      + '  </script>\n'
      + '</body>\n'
      + '</html>';
    fs.writeFileSync(filePath, html);
    urls.push(baseUrl + '/terms/' + slug + '.html');
  });

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map((u) => '  <url><loc>' + u + '</loc></url>').join('\n') + '\n'
    + '</urlset>';
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
}

build();
