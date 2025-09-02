import PosTabs from '@/components/PosTabs';

interface WordPageProps {
  params: {
    slug: string;
  };
}

export default function WordPage({ params }: WordPageProps) {
  return (
    <div>
      <h1>{params.slug}</h1>
      <PosTabs slug={params.slug} />
    </div>
  );
}

