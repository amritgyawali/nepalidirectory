import { ContentTemplate } from "@/components/directory/ContentTemplate";
import { contentPages } from "@/lib/content";

export default function TermsPage() {
  return <ContentTemplate page={contentPages.terms} />;
}
