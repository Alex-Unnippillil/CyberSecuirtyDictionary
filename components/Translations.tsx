import React, { useEffect, useState } from "react";

interface TranslationMap {
  [language: string]: string;
}

interface TranslationsProps {
  slug: string;
}

const Translations: React.FC<TranslationsProps> = ({ slug }) => {
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let isCurrent = true;
    setLoading(true);

    fetch(`/api/translate?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data: TranslationMap) => {
        if (!isCurrent) return;
        setTranslations(data || {});
        setError(null);
      })
      .catch((err) => {
        if (!isCurrent) return;
        console.error(err);
        setError("Failed to load translations");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  if (loading) {
    return <p>Loading translations…</p>;
  }

  if (error) {
    return (
      <p role="alert" className="translations-error">
        {error}
      </p>
    );
  }

  const entries = Object.entries(translations);
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
