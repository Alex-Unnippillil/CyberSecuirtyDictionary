import SearchBar from "../components/search/SearchBar";
import useSocket from "../hooks/useSocket";

export default function Home() {
  // Establish a Socket.IO connection when the home page mounts.
  useSocket();

  return (
    <main>
      <h1>Cyber Security Dictionary</h1>
      <SearchBar />
    </main>
  );
}
