import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexMetadata } from "@/lib/noindex";

// Noindex, with a canonical so ?next= variants consolidate onto one URL.
export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Sign in",
  description: "Sign in to NepaliDirectory to manage your business listing, saved places and reviews.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
