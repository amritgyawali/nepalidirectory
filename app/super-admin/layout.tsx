import type { ReactNode } from "react";
import { SuperAdminShell } from "@/components/superadmin/SuperAdminShell";
import { noIndexMetadata } from "@/lib/noindex";

export const metadata = noIndexMetadata;

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
