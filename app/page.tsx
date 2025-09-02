import SearchBar from "../components/search/SearchBar";
import Script from "next/script";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cyber Security Dictionary",
    url: "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <h1>Cyber Security Dictionary</h1>
        <SearchBar />
      </main>
    </>
  );
}
