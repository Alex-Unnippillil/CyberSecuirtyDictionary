import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { z } from 'zod';

const TermSchema = z.object({
  slug: z.string().min(1, 'slug is required'),
  title: z.string().min(1, 'title is required'),
  shortDef: z.string().min(1, 'shortDef is required'),
  sources: z.array(z.string().min(1)).min(1, 'sources is required'),
});

function getMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      return getMarkdownFiles(res);
    }
    return dirent.isFile() && res.endsWith('.md') ? [res] : [];
  });
}

const termsDir = path.join(process.cwd(), 'data');
const files = fs.existsSync(termsDir) ? getMarkdownFiles(termsDir) : [];

if (files.length === 0) {
  console.log('No term markdown files found.');
  process.exit(0);
}

let hasError = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  if (!match) {
    console.error(`${file}: Missing front matter`);
    hasError = true;
    continue;
  }

  let frontMatter: unknown;
  try {
    frontMatter = yaml.load(match[1]);
  } catch (err) {
    console.error(`${file}: Failed to parse front matter - ${(err as Error).message}`);
    hasError = true;
    continue;
  }

  const result = TermSchema.safeParse(frontMatter);
  if (!result.success) {
    console.error(`${file}:`);
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('All term front matter valid');
}
