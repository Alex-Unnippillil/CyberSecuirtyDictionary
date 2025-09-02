import Head from "next/head";
import SearchBar from "../components/search/SearchBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cyber Security Dictionary</title>
        <meta
          name="description"
          content="Look up cybersecurity terms and definitions."
        />
        <meta
          property="og:title"
          content="Cyber Security Dictionary"
        />
        <meta
          property="og:description"
          content="Look up cybersecurity terms and definitions."
        />
      </Head>
      <main>
        <h1>Cyber Security Dictionary</h1>
        <SearchBar />
      </main>
    </>
  );
}
