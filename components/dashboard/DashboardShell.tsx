"use client";

import {
  BarChart3,
  Bell,
  Building2,
  Camera,
  Clock,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  Settings,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { DashboardProvider, useDashboardData } from "@/components/dashboard/DashboardProvider";
import { routes } from "@/lib/routes";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { label: "Overview", href: routes.dashboard, icon: BarChart3 },
  { label: "My Listings", href: routes.dashboardListings, icon: Building2 },
  { label: "Reviews", href: routes.dashboardReviews, icon: MessageSquareText },
  { label: "Photos", href: routes.gallery, icon: Camera },
  { label: "Hours & Info", href: `${routes.account}?section=hours`, icon: Clock, section: "hours" },
  { label: "Insights", href: routes.dashboardAnalytics, icon: TrendingUp },
  { label: "Settings", href: `${routes.account}?section=settings`, icon: Settings, section: "settings" }
];

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("dashboard-mode");

    setReady(true);

    return () => document.body.classList.remove("dashboard-mode");
  }, [router]);

  async function logout() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      await createClient().auth.signOut();
    }
    router.replace(routes.login);
    router.refresh();
  }

  if (!ready) {
    return (
      <main className="dashboard-loading">
        <strong>Checking admin session...</strong>
      </main>
    );
  }

  return (
    <DashboardProvider>
      <DashboardChrome logout={logout}>{children}</DashboardChrome>
    </DashboardProvider>
  );
}

function DashboardChrome({
  children,
  logout
}: {
  children: ReactNode;
  logout: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, unreadNotifications, markAllNotificationsRead, markNotificationRead } = useDashboardData();
  const [openMenu, setOpenMenu] = useState<"notifications" | "account" | null>(null);
  const pendingReviews = state.reviews.filter((review) => !review.reply.trim()).length;
  const initials = state.profile.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const accountSection = searchParams.get("section") ?? "profile";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <Link className="dashboard-brand" href={routes.dashboard}>
            <span>ND</span>
            <strong>
              NepaliDirectory <small>for Business</small>
            </strong>
          </Link>
        </div>
        <div className="dashboard-topbar__actions">
          <div className="dashboard-topbar__menu">
            <button
              aria-expanded={openMenu === "notifications"}
              aria-label="Notifications"
              onClick={() => setOpenMenu((current) => (current === "notifications" ? null : "notifications"))}
              type="button"
            >
              <Bell size={17} aria-hidden />
              {unreadNotifications > 0 ? <span>{unreadNotifications}</span> : null}
            </button>
            {openMenu === "notifications" ? (
              <div className="dashboard-popover">
                <div className="dashboard-popover__head">
                  <strong>Notifications</strong>
                  <button onClick={markAllNotificationsRead} type="button">
                    Mark all read
                  </button>
                </div>
                <div className="dashboard-popover__list">
                  {state.notifications.map((notification) => (
                    <button
                      className={notification.unread ? "is-unread" : ""}
                      key={notification.id}
                      onClick={() => markNotificationRead(notification.id)}
                      type="button"
                    >
                      <strong>{notification.title}</strong>
                      <small>{notification.detail}</small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Link href={routes.pricing}>Upgrade plan</Link>
          <div className="dashboard-topbar__menu">
            <button
              className="dashboard-avatar"
              onClick={() => setOpenMenu((current) => (current === "account" ? null : "account"))}
              type="button"
            >
              {initials || "AD"}
            </button>
            {openMenu === "account" ? (
              <div className="dashboard-popover dashboard-popover--account">
                <div className="dashboard-account-card">
                  <strong>{state.profile.fullName}</strong>
                  <small>{state.profile.email}</small>
                </div>
                <Link href={`${routes.account}?section=profile`}>
                  <ShieldCheck size={15} aria-hidden />
                  Account profile
                </Link>
                <Link href={`${routes.account}?section=settings`}>
                  <Settings size={15} aria-hidden />
                  Preferences
                </Link>
              </div>
            ) : null}
          </div>
          <button aria-label="Log out" onClick={logout} type="button">
            <LogOut size={17} aria-hidden />
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <span className="dashboard-sidebar__label">Manage</span>
          <nav>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAccountMatch =
                pathname === routes.account && item.section && item.section === accountSection;
              const isActive = pathname === item.href || isAccountMatch;
              const count = item.label === "Reviews" && pendingReviews > 0 ? String(pendingReviews) : null;

              return (
                <Link className={isActive ? "active" : ""} href={item.href} key={item.label}>
                  <Icon size={17} aria-hidden />
                  {item.label}
                  {count ? <span>{count}</span> : null}
                </Link>
              );
            })}
          </nav>
          <div className="dashboard-upgrade">
            <strong>You are on Free</strong>
            <p>Featured businesses get stronger placement in category and city searches.</p>
            <Link href={routes.pricing}>See plans</Link>
          </div>
        </aside>

        {children}
      </div>
    </main>
  );
}
