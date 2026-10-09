import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexMetadata } from "@/lib/noindex";

// Noindex, with a canonical so ?next= variants consolidate onto one URL.
export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Create an account",
  description: "Create a free NepaliDirectory account to add or claim a business listing in Nepal.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
