"use client";

import {
  BarChart3,
  BrainCircuit,
  Building2,
  ClipboardList,
  Gauge,
  GitPullRequestArrow,
  LogOut,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { routes } from "@/lib/routes";
import { SuperAdminProvider, useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

const sessionKey = "nd-superadmin-session";

const navItems = [
  { label: "Overview", href: routes.superAdmin, icon: Gauge },
  { label: "Approvals", href: routes.superAdminApprovals, icon: GitPullRequestArrow },
  { label: "Businesses", href: routes.superAdminBusinesses, icon: Building2 },
  { label: "Users", href: routes.superAdminUsers, icon: UsersRound },
  { label: "Referrals", href: routes.superAdminReferrals, icon: BarChart3 },
  { label: "Controls", href: routes.superAdminControls, icon: SlidersHorizontal },
  { label: "AI Console", href: routes.adminAi, icon: BrainCircuit },
  { label: "Audit Log", href: routes.superAdminAudit, icon: ClipboardList },
  { label: "Settings", href: routes.superAdminSettings, icon: Settings2 }
];

export function SuperAdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("superadmin-mode");

    if (!localStorage.getItem(sessionKey)) {
      router.replace(`${routes.login}?next=${encodeURIComponent(routes.superAdmin)}&role=superadmin`);
      return () => document.body.classList.remove("superadmin-mode");
    }

    setReady(true);

    return () => document.body.classList.remove("superadmin-mode");
  }, [router]);

  function logout() {
    localStorage.removeItem(sessionKey);
    router.push(`${routes.login}?role=superadmin`);
  }

  if (!ready) {
    return (
      <main className="dashboard-loading">
        <strong>Checking super admin session...</strong>
      </main>
    );
  }

  return (
    <SuperAdminProvider>
      <SuperAdminChrome logout={logout}>{children}</SuperAdminChrome>
    </SuperAdminProvider>
  );
}

function SuperAdminChrome({ children, logout }: { children: ReactNode; logout: () => void }) {
  const pathname = usePathname();
  const { totals } = useSuperAdminData();

  return (
    <main className="superadmin-shell">
      <header className="superadmin-topbar">
        <Link className="superadmin-brand" href={routes.superAdmin}>
          <span>ND</span>
          <strong>
            Super Admin <small>Platform control center</small>
          </strong>
        </Link>
        <div className="superadmin-topbar__meta">
          <span>
            <ShieldCheck size={16} aria-hidden />
            Root access
          </span>
          <span>{totals.pending} pending approvals</span>
          <button onClick={logout} type="button">
            <LogOut size={16} aria-hidden />
            Log out
          </button>
        </div>
      </header>

      <div className="superadmin-layout">
        <aside className="superadmin-sidebar">
          <span>Platform</span>
          <nav>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const count = item.label === "Approvals" && totals.pending > 0 ? totals.pending : null;

              return (
                <Link className={isActive ? "active" : ""} href={item.href} key={item.label}>
                  <Icon size={17} aria-hidden />
                  {item.label}
                  {count ? <em>{count}</em> : null}
                </Link>
              );
            })}
          </nav>
          <div className="superadmin-lock">
            <ShieldCheck size={18} aria-hidden />
            <strong>High privilege area</strong>
            <p>All actions affect listing approval, visibility and platform governance state.</p>
          </div>
        </aside>
        <section className="superadmin-main">{children}</section>
      </div>
    </main>
  );
}
