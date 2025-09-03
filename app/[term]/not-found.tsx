import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-6">
      <h2>Page not found</h2>
      <Link href="/">Go home</Link>
    </div>
  );
}
