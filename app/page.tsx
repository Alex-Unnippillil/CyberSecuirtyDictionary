import type { Metadata } from "next";
import SearchBar from "../components/search/SearchBar";
import HomeClientEffects from "./HomeClientEffects";

export const metadata: Metadata = {
  title: "Cyber Security Dictionary",
  description: "Look up cybersecurity terms and definitions.",
  openGraph: {
    title: "Cyber Security Dictionary",
    description: "Look up cybersecurity terms and definitions.",
  },
};

export default function Home() {
  return (
    <main>
      <HomeClientEffects />
      <h1>Cyber Security Dictionary</h1>
      <SearchBar />
    </main>
  );
}
