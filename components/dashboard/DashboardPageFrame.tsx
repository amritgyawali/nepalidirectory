import type { ReactNode } from "react";

type DashboardPageFrameProps = {
  children: ReactNode;
};

export function DashboardPageFrame({ children }: DashboardPageFrameProps) {
  return <section className="dashboard-main">{children}</section>;
}
