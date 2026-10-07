/**
 * Visible guidance for /claim-listing. The client page renders it and the server layout emits the
 * matching HowTo/FAQPage JSON-LD, so structured data always mirrors on-page copy.
 */
export const claimListingSummary =
  "To add a business to Nepali Directory, create a free account, submit the exact business name, category, address, phone, hours and services, then pass ownership and source review. The profile appears in search, city and category pages only after it is approved.";

export const claimListingSteps = [
  {
    name: "Create an account or sign in",
    text: "Use a secure account so ownership of the profile can be confirmed and changes can be traced.",
  },
  {
    name: "Enter the exact business details",
    text: "Add the business name, primary category, full address, phone number and current opening hours exactly as customers can verify them.",
  },
  {
    name: "Describe services and service area",
    text: "Write a plain-language description, list the main services and the areas you serve, and add a photo that shows the real business.",
  },
  {
    name: "Submit for ownership review",
    text: "Ownership, category and source checks run before publication to keep duplicate, sample or unapproved records out of search.",
  },
  {
    name: "Keep the profile current",
    text: "After approval, manage hours, services and contact details from the owner dashboard and request corrections when anything changes.",
  },
] as const;

export const claimListingFaqs = [
  {
    question: "Is it free to add a business listing in Nepal on Nepali Directory?",
    answer:
      "Yes. A basic business profile is free. Paid plans only add clearly labelled promotion and management tools and never buy an organic ranking.",
  },
  {
    question: "What if my business is already listed?",
    answer:
      "Claim the existing profile instead of creating a new one. Duplicate submissions are merged or declined during review.",
  },
  {
    question: "When will my listing appear in search results?",
    answer:
      "A listing appears once it passes ownership, category and completeness review. Missing or unverifiable details hold the profile back until they are supplied.",
  },
  {
    question: "Can I edit my listing after it is published?",
    answer:
      "Yes. Owners can update details from the dashboard. Material changes such as the name, category or address are reviewed again before they go live.",
  },
] as const;
