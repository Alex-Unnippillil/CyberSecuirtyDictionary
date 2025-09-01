import Link from 'next/link';

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function AlphaIndex() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 1000,
        padding: '0.5rem',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}
    >
      {letters.map(letter => (
        <Link key={letter} href={`/letter/${letter}`}>
          {letter}
        </Link>
      ))}
    </nav>
  );
}
