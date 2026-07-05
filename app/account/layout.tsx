import type { ReactNode } from "react";
import { noIndexMetadata } from "@/lib/noindex";

export const metadata = noIndexMetadata;

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
