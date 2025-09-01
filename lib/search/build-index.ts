import MiniSearch from "minisearch";

export interface Term {
  term: string;
  name?: string;
  definition?: string;
  category?: string;
  synonyms?: string[];
}

export function buildIndex(terms: Term[]) {
  const miniSearch = new MiniSearch({
    fields: ["term", "name", "definition", "category", "synonyms"],
    storeFields: ["term", "name", "definition", "category", "synonyms"],
    idField: "id",
  });

  const docs = terms.map((t, idx) => ({
    id: idx,
    term: t.term || t.name || "",
    name: t.name || t.term || "",
    definition: t.definition || "",
    category: t.category || "",
    synonyms: t.synonyms || [],
  }));

  miniSearch.addAll(docs);
  return miniSearch.toJSON();
}
