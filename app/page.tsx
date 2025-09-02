import Head from "next/head";
import SearchBar from "../components/search/SearchBar";
import useSocket from "../hooks/useSocket";

export default function Home() {
  // Establish a Socket.IO connection when the home page mounts.
  useSocket();

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
