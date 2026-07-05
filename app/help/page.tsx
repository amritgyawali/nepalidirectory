import { ContentTemplate } from "@/components/directory/ContentTemplate";
import { contentPages } from "@/lib/content";

export default function HelpPage() {
  return <ContentTemplate page={contentPages.help} />;
}
