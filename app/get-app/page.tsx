import { AppPromo } from "@/components/directory/AppPromo";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function GetAppPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Get the App" }]} />
      <PageHero
        title="Get the Nepali Directory app"
        subtitle="Save businesses, open maps, read reviews and call verified listings from your phone."
      />
      <AppPromo />
    </main>
  );
}
