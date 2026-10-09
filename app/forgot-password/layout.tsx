import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexMetadata } from "@/lib/noindex";

// Noindex, with a canonical so ?next= variants consolidate onto one URL.
export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Reset your password",
  description: "Reset the password for your NepaliDirectory account.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
