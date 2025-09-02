import React from "react";
import useSWR from "swr";

interface TranslationMap {
  [language: string]: string;
}

interface TranslationsProps {
  slug: string;
}

const Translations: React.FC<TranslationsProps> = ({ slug }) => {
  const { data, error, isLoading } = useSWR<TranslationMap>(
    slug ? `/api/translate?slug=${encodeURIComponent(slug)}` : null,
    { refreshInterval: 300000 }
  );

  if (isLoading) {
    return <p>Loading translations…</p>;
  }

  if (error) {
    return (
      <p role="alert" className="translations-error">
        Failed to load translations
      </p>
    );
  }

  const entries = Object.entries(data || {});
  if (!entries.length) {
    return null;
  }

  return (
    <section className="translations">
      <h2>Translations</h2>
      <div className="accordion">
        {entries.map(([lang, text]) => (
          <details key={lang} className="accordion-item">
            <summary className="accordion-header">{lang.toUpperCase()}</summary>
            <div className="accordion-panel">
              <p>{text}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Translations;
