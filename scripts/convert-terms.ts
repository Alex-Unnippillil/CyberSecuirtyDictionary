import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const schema = z.object({
  terms: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    })
  ),
});

const data = schema.parse(JSON.parse(fs.readFileSync('terms.json', 'utf8')));
const outDir = path.join(process.cwd(), 'content/terms');
fs.mkdirSync(outDir, { recursive: true });

for (const t of data.terms) {
  const slug = t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const mdx = `---\nterm: "${t.term.replace(/"/g, '\\"')}"\ndefinition: "${t.definition.replace(/"/g, '\\"')}"\n---\n`;
  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), mdx);
}
