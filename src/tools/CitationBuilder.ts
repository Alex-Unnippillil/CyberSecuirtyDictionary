import copyToClipboard from "../../lib/copyToClipboard";
export type CitationStyle = "MLA" | "APA";

/**
 * Utility to build citations for dictionary terms and copy them to the
 * clipboard. The chosen citation style is persisted in `localStorage` so the
 * user does not have to re-select it for subsequent citations.
 */
export class CitationBuilder {
  private static readonly STORAGE_KEY = "citation-style";

  constructor(
    private readonly siteName: string,
    private readonly siteUrl: string,
  ) {}

  /** Build the permalink for a given term. */
  private buildUrl(term: string): string {
    return `${this.siteUrl}#${encodeURIComponent(term)}`;
  }

  /**
   * Retrieve the last used citation style from `localStorage`.
   * Defaults to "MLA" if nothing has been stored.
   */
  getPreferredStyle(): CitationStyle {
    const stored =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(CitationBuilder.STORAGE_KEY)
        : null;
    return stored === "APA" || stored === "MLA" ? stored : "MLA";
  }

  /** Save the preferred citation style to localStorage. */
  setPreferredStyle(style: CitationStyle): void {
    try {
      localStorage.setItem(CitationBuilder.STORAGE_KEY, style);
    } catch {
      // Ignore storage errors (private browsing, etc.)
    }
  }

  /**
   * Build a citation string for the given term and style.
   *
   * @param term The dictionary term being cited.
   * @param style Citation style to use (MLA or APA).
   * @param date Optional date to use for "accessed"/"retrieved" fields. Defaults to now.
   */
  buildCitation(
    term: string,
    style: CitationStyle,
    date: Date = new Date(),
  ): string {
    const url = this.buildUrl(term);
    const accessDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (style === "APA") {
      // Example: Term. (2024). In CyberSecurity Dictionary. Retrieved May 1, 2024, from https://example.com#Term
      return `${term}. (${date.getFullYear()}). In ${this.siteName}. Retrieved ${accessDate}, from ${url}`;
    }

    // MLA style
    // Example: "Term." CyberSecurity Dictionary, 2024, https://example.com#Term. Accessed May 1, 2024.
    return `"${term}." ${this.siteName}, ${date.getFullYear()}, ${url}. Accessed ${accessDate}.`;
  }

  /**
   * Build the citation and copy it to the clipboard as both plain text and
   * HTML with a clickable link. The chosen style is persisted.
   */
  async copyCitation(term: string, style: CitationStyle): Promise<void> {
    this.setPreferredStyle(style);
    const citation = this.buildCitation(term, style);
    const url = this.buildUrl(term);
    const html = `<a href="${url}">${citation}</a>`;

    try {
      const item = new ClipboardItem({
        "text/plain": new Blob([citation], { type: "text/plain" }),
        "text/html": new Blob([html], { type: "text/html" }),
      });
      await navigator.clipboard.write([item]);
    } catch {
      // Fallback for browsers without ClipboardItem support
      await copyToClipboard(citation);
    }
  }
}
