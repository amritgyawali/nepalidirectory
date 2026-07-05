import { FormCard } from "@/components/ui/FormCard";

export default function WriteReviewPage() {
  return (
    <FormCard
      title="Write a review"
      description="Share a specific, fair and useful experience to help other people choose confidently."
      fields={[
        { label: "Business name", placeholder: "Newa Lahana" },
        { label: "Rating", placeholder: "1 to 5" },
        { label: "Review", placeholder: "What stood out?" }
      ]}
      submitLabel="Submit review"
    />
  );
}
