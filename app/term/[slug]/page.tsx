import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import TermPage from "@/components/term/TermPage";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const filePath = path.join(process.cwd(), "terms", `${params.slug}.mdx`);
  let file: string;
  try {
    file = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }
  const { content, data } = matter(file!);
  return (
    <TermPage
      title={data.title ?? params.slug}
      body={content}
      sources={data.sources}
      summary={data.summary}
    />
  );
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "terms");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => ({ slug: e.name.replace(/\.mdx$/, "") }));
}
