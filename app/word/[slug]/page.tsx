import React from 'react';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function WordPage({ params }: PageProps) {
  const word = decodeURIComponent(params.slug);
  return (
    <nav>
      Home &gt; English &gt; {word}
    </nav>
  );
}
