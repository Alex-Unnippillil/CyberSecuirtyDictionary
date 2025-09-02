import { fetchGithubRepo } from '../../lib/api';

export default async function GithubPage() {
  const { data, error } = await fetchGithubRepo('vercel', 'next.js');

  if (error) {
    return (
      <main>
        <h1>Repository Info</h1>
        <p>Failed to load repository: {error.message}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{data?.full_name}</h1>
      <p>{data?.description}</p>
      <p>⭐ {data?.stargazers_count}</p>
    </main>
  );
}
