import { ContentTemplate } from "@/components/directory/ContentTemplate";
import { contentPages } from "@/lib/content";

export default function AboutPage() {
  return <ContentTemplate page={contentPages.about} />;
}
