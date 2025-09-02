import dynamic from "next/dynamic";

const SearchBar = dynamic(
  () => import("../components/search/SearchBar"),
  { loading: () => <p>Loading search...</p>, ssr: false },
);

export default function Home() {
  return (
    <main>
      <h1>Cyber Security Dictionary</h1>
      <SearchBar />
    </main>
  );
}
