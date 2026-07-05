import { FormCard } from "@/components/ui/FormCard";

export default function RequestCallbackPage() {
  return (
    <FormCard
      title="Request a callback"
      description="Tell us what you need help with and our support team will call during business hours."
      fields={[
        { label: "Name", placeholder: "Your name" },
        { label: "Phone", type: "tel", placeholder: "(01) 555-0198" },
        { label: "Business or topic", placeholder: "Listing update, advertising, support" }
      ]}
      submitLabel="Request callback"
    />
  );
}
