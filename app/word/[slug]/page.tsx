import { redirect } from "next/navigation";

export default function DeprecatedWordRoute({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/term/${params.slug}`);
}
