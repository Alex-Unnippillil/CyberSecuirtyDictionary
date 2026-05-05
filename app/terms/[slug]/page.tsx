import { redirect } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default function DeprecatedTermsRoute({ params }: PageProps) {
  redirect(`/term/${params.slug}`);
}
