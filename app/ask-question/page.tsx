import { FormCard } from "@/components/ui/FormCard";

export default function AskQuestionPage() {
  return (
    <FormCard
      title="Ask the community"
      description="Get practical local answers from residents, business owners and travellers."
      fields={[
        { label: "Question title", placeholder: "What do you want to know?" },
        { label: "Category", placeholder: "Travel, restaurants, home services..." },
        { label: "Details", placeholder: "Add useful context" }
      ]}
      submitLabel="Publish question"
    />
  );
}
