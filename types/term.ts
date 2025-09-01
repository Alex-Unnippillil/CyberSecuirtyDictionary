export interface Ref {
  name: string;
  url: string;
}

export interface Related {
  slug: string;
  name?: string;
}

export interface TermMeta {
  title: string;
  slug: string;
  definition: string;
  category?: string;
  synonyms?: string[];
  related?: Related[];
  sources?: Ref[];
}

export interface TermDoc extends TermMeta {
  body: string;
}
