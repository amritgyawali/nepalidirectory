import { FormCard } from "@/components/ui/FormCard";
import { routes } from "@/lib/routes";

export default function RegisterPage() {
  return (
    <FormCard
      title="Create account"
      description="Create an account to save places and manage business listing submissions."
      fields={[
        { label: "Full name", placeholder: "Your name" },
        { label: "Email", type: "email", placeholder: "you@example.com" },
        { label: "Password", type: "password", placeholder: "Create a password" }
      ]}
      submitLabel="Sign up"
      helperLink={{ label: "Already have an account?", href: routes.login }}
    />
  );
}
