import { promises as fs } from 'fs';
import path from 'path';
const matter = require('gray-matter');

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'public'].includes(entry.name)) continue;
      files.push(...await collectMdxFiles(res));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(res);
    }
  }
  return files;
}

async function buildIndex() {
  const root = process.cwd();
  const mdxFiles = await collectMdxFiles(root);
  const index: any[] = [];

  for (const file of mdxFiles) {
    const raw = await fs.readFile(file, 'utf8');
    const fm = matter(raw);
    const data = fm.data || {};
    index.push({
      name: data.title || data.name || '',
      definition: data.description || data.summary || '',
      category: data.category || '',
      synonyms: data.synonyms || [],
      slug: data.slug || path.basename(file, path.extname(file))
    });
  }

  const outputDir = path.join(root, 'public');
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'search-index.json');
  await fs.writeFile(outputPath, JSON.stringify(index, null, 2));
  console.log(`Wrote ${index.length} records to ${outputPath}`);
}

buildIndex().catch((err) => {
  console.error(err);
  process.exit(1);
});
