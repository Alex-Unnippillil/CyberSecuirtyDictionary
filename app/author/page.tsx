import Script from "next/script";

export const metadata = {
  title: "Author Dashboard",
};

export default function AuthorPage() {
  return (
    <>
      <main className="container" id="author-dashboard">
        <h1>Author Dashboard</h1>
        <section id="review-queue">
          <h2>Review Queue</h2>
          <ul id="queue-list"></ul>
        </section>
        <section id="validation-errors">
          <h2>Validation Errors</h2>
          <ul id="error-list"></ul>
        </section>
      </main>
      <Script src="/author.js" />
    </>
  );
}
