import { MDXRemote } from 'next-mdx-remote/rsc';
import SessionTimeline from '@/components/SessionTimeline';

interface SourceLinks {
  nist?: string;
  owasp?: string;
  attack?: string;
}

interface TermPageProps {
  title: string;
  body: string;
  sources?: SourceLinks;
  /** Slug used for navigation and session tracking */
  slug: string;
}

/**
 * Renders a security term page including MDX content and optional sources.
 */
export default function TermPage({ title, body, sources, slug }: TermPageProps) {
  const hasSources = sources && (sources.nist || sources.owasp || sources.attack);

  return (
    <article className="term">
      <h1>{title}</h1>
      <MDXRemote source={body} />
      {hasSources && (
        <section className="sources">
          <h2>Sources</h2>
          <ul>
            {sources?.nist && (
              <li>
                NIST: <a href={sources.nist}>{sources.nist}</a>
              </li>
            )}
            {sources?.owasp && (
              <li>
                OWASP: <a href={sources.owasp}>{sources.owasp}</a>
              </li>
            )}
            {sources?.attack && (
              <li>
                ATT&CK: <a href={sources.attack}>{sources.attack}</a>
              </li>
            )}
          </ul>
        </section>
      )}
      <SessionTimeline current={{ slug, title }} />
    </article>
  );
}
