import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page Not Found</h1>
      <p>Sorry, we couldn't find the page you're looking for.</p>
      <p>
        Try going back to the <Link href="/search">search page</Link>.
      </p>
    </main>
  );
}
