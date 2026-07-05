import { FormCard } from "@/components/ui/FormCard";
import { routes } from "@/lib/routes";

export default function ForgotPasswordPage() {
  return (
    <FormCard
      title="Reset password"
      description="Enter the email on your account and we will send password reset instructions."
      fields={[{ label: "Email", type: "email", placeholder: "you@example.com" }]}
      submitLabel="Send reset link"
      helperLink={{ label: "Back to login", href: routes.login }}
    />
  );
}
