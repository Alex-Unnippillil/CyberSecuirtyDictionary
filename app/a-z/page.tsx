import AZIndex from "@components/search/AZIndex";
import termsData from "@/terms.json";

export default function AZPage() {
  return <AZIndex terms={termsData.terms} />;
}

