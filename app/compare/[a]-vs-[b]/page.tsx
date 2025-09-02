import type { Metadata } from "next";
import { notFound } from "next/navigation";
import termsData from "@/terms.json";
import CompareClient, { Term } from "./CompareClient";

type Params = { a: string; b: string };

function findTerm(slug: string): Term | undefined {
  const normalized = decodeURIComponent(slug).replace(/-/g, " ").toLowerCase();
  return termsData.terms.find((t: Term) => t.term.toLowerCase() === normalized);
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const termA = findTerm(params.a);
  const termB = findTerm(params.b);
  if (!termA || !termB) notFound();
  return {
    title: `${termA.term} vs ${termB.term} \u2013 Cyber Security Dictionary`,
  };
}

export default function ComparePage({ params }: { params: Params }) {
  const termA = findTerm(params.a);
  const termB = findTerm(params.b);
  if (!termA || !termB) notFound();
  return <CompareClient termA={termA} termB={termB} />;
}
