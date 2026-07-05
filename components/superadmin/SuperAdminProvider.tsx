"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { businesses } from "@/lib/data";

const DASHBOARD_STORAGE_KEY = "nd-dashboard:v1";

export type AdminListing = {
  slug: string;
  name: string;
  address: string;
  category: string;
  image: string;
  operatingStatus: string;
  visibility: "Live" | "Paused" | "Pending" | "Rejected";
  approvalStatus?: "Approved" | "Pending" | "Rejected";
  verified: boolean;
  completeness: number;
  ownerName?: string;
  area?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  hours?: string;
};

type StoredDashboardState = {
  listings?: AdminListing[];
  users?: AdminUser[];
  auditLogs?: AuditLog[];
  notifications?: Array<{ id: string; title: string; detail: string; unread: boolean }>;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Business Owner" | "Reviewer" | "Editor" | "Super Admin";
  status: "Active" | "Watchlist" | "Suspended";
  lastSeen: string;
  businesses: number;
  reviews: number;
};

export type AdminUserInput = Omit<AdminUser, "id">;

export type AuditLog = {
  id: string;
  action: string;
  actor: string;
  target: string;
  detail: string;
  createdAt: string;
  severity: "Info" | "Warning" | "Critical";
};

type ReferralSource = {
  source: string;
  visits: number;
  signups: number;
  conversion: string;
};

type TrafficPoint = {
  label: string;
  visitors: number;
  searches: number;
  signups: number;
};

type SuperAdminContextValue = {
  isReady: boolean;
  listings: AdminListing[];
  users: AdminUser[];
  referrals: ReferralSource[];
  traffic: TrafficPoint[];
  totals: {
    businesses: number;
    approved: number;
    pending: number;
    rejected: number;
    users: number;
    visitorsToday: number;
    searchesToday: number;
    reviews: number;
  };
  businessViews: Array<AdminListing & { views: number; calls: number; directions: number; owner: string }>;
  auditLogs: AuditLog[];
  recordAudit: (action: string, target: string, detail: string, severity?: AuditLog["severity"]) => void;
  approveListing: (slug: string) => void;
  rejectListing: (slug: string) => void;
  pauseListing: (slug: string) => void;
  restoreListing: (slug: string) => void;
  deleteListing: (slug: string) => void;
  approveAllPending: () => void;
  rejectLowCompleteness: (threshold: number) => void;
  pauseAllListings: () => void;
  restoreAllListings: () => void;
  addUser: (user: AdminUserInput) => void;
  updateUser: (id: string, user: AdminUserInput) => void;
  deleteUser: (id: string) => void;
  suspendUser: (id: string) => void;
  restoreUser: (id: string) => void;
  suspendWatchlistUsers: () => void;
  restoreAllUsers: () => void;
  clearAuditLogs: () => void;
};

const SuperAdminContext = createContext<SuperAdminContextValue | null>(null);

function toHoursLabel(status: "open" | "closed" | "24h", hoursToday: string) {
  if (status === "24h") return "Open 24 hours";
  return hoursToday;
}

function seedListings(): AdminListing[] {
  return businesses.map((business, index) => ({
    slug: business.slug,
    name: business.name,
    address: business.address,
    category: business.categories[0],
    image: business.image,
    operatingStatus: toHoursLabel(business.status, business.hoursToday),
    visibility: index < 9 ? "Live" : "Paused",
    approvalStatus: index < 9 ? "Approved" : "Pending",
    verified: Boolean(business.verified),
    completeness: index === 0 ? 92 : Math.min(98, 70 + index * 3),
    ownerName: business.owner?.name ?? `${business.name} Team`,
    area: business.area,
    phone: business.phone,
    email: business.email,
    website: business.website,
    description: business.quote,
    hours: business.hoursToday
  }));
}

function getStoredDashboardState(): StoredDashboardState | null {
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredDashboardState) : null;
  } catch {
    return null;
  }
}

function saveListings(listings: AdminListing[]) {
  const current = getStoredDashboardState() ?? {};
  const notifications = [
    {
      id: `superadmin-sync-${Date.now()}`,
      title: "Super admin updated listings",
      detail: "Listing status and approval controls were synchronized.",
      unread: true
    },
    ...(current.notifications ?? [])
  ].slice(0, 25);

  localStorage.setItem(
    DASHBOARD_STORAGE_KEY,
    JSON.stringify({
      ...current,
      listings,
      notifications
    })
  );
}

function saveUsers(users: AdminUser[]) {
  const current = getStoredDashboardState() ?? {};
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify({ ...current, users }));
}

function saveAuditLogs(auditLogs: AuditLog[]) {
  const current = getStoredDashboardState() ?? {};
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify({ ...current, auditLogs }));
}

function mergeListings(storedListings?: AdminListing[]) {
  const seeds = seedListings();

  if (!storedListings?.length) return seeds;

  const bySlug = new Map(seeds.map((listing) => [listing.slug, listing]));
  storedListings.forEach((listing) => {
    bySlug.set(listing.slug, {
      ...bySlug.get(listing.slug),
      ...listing,
      approvalStatus:
        listing.approvalStatus ??
        (listing.visibility === "Live" ? "Approved" : listing.visibility === "Rejected" ? "Rejected" : "Pending")
    });
  });

  return [...bySlug.values()];
}

function getTimestampLabel() {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

function buildUsers(listings: AdminListing[]): AdminUser[] {
  const ownerUsers = listings.slice(0, 14).map((listing, index) => ({
    id: `owner-${listing.slug}`,
    name: listing.ownerName || `${listing.name} Owner`,
    email: listing.email || `owner${index + 1}@nepalidirectory.example`,
    role: "Business Owner" as const,
    status: listing.approvalStatus === "Rejected" ? ("Watchlist" as const) : ("Active" as const),
    lastSeen: index < 4 ? "Today" : index < 8 ? "Yesterday" : "This week",
    businesses: 1,
    reviews: 2 + index * 3
  }));

  return [
    {
      id: "superadmin-root",
      name: "Super Admin",
      email: "superadmin@nepalidirectory.example",
      role: "Super Admin",
      status: "Active",
      lastSeen: "Now",
      businesses: listings.length,
      reviews: 0
    },
    ...ownerUsers,
    {
      id: "editor-food",
      name: "Food Desk Editor",
      email: "fooddesk@nepalidirectory.example",
      role: "Editor",
      status: "Active",
      lastSeen: "Today",
      businesses: 0,
      reviews: 86
    },
    {
      id: "reviewer-community",
      name: "Community Reviewer",
      email: "reviews@nepalidirectory.example",
      role: "Reviewer",
      status: "Watchlist",
      lastSeen: "2 days ago",
      businesses: 0,
      reviews: 142
    }
  ];
}

function buildAuditLogs(listings: AdminListing[], users: AdminUser[]): AuditLog[] {
  return [
    {
      id: "audit-root-login",
      action: "Super admin login",
      actor: "Super Admin",
      target: "Control center",
      detail: "Root account opened the protected super admin dashboard.",
      createdAt: "Now",
      severity: "Info"
    },
    {
      id: "audit-pending-queue",
      action: "Approval queue checked",
      actor: "Super Admin",
      target: `${listings.filter((listing) => listing.approvalStatus === "Pending").length} pending listings`,
      detail: "Pending business submissions are waiting for approval or rejection.",
      createdAt: "Today",
      severity: listings.some((listing) => listing.approvalStatus === "Pending") ? "Warning" : "Info"
    },
    {
      id: "audit-user-review",
      action: "User governance snapshot",
      actor: "System",
      target: `${users.length} admin-visible users`,
      detail: "User list includes business owners, reviewers, editors and super admin accounts.",
      createdAt: "Today",
      severity: "Info"
    }
  ];
}

const referrals: ReferralSource[] = [
  { source: "Google Search", visits: 18420, signups: 842, conversion: "4.6%" },
  { source: "Direct / Bookmarks", visits: 9360, signups: 315, conversion: "3.4%" },
  { source: "Facebook", visits: 5210, signups: 192, conversion: "3.7%" },
  { source: "Instagram", visits: 3880, signups: 141, conversion: "3.6%" },
  { source: "TikTok", visits: 2410, signups: 96, conversion: "4.0%" },
  { source: "Partner blogs", visits: 1680, signups: 74, conversion: "4.4%" },
  { source: "Maps / local packs", visits: 12940, signups: 516, conversion: "4.0%" }
];

const traffic: TrafficPoint[] = [
  { label: "Mon", visitors: 18200, searches: 9210, signups: 284 },
  { label: "Tue", visitors: 19740, searches: 10380, signups: 312 },
  { label: "Wed", visitors: 21180, searches: 11820, signups: 354 },
  { label: "Thu", visitors: 22620, searches: 12640, signups: 386 },
  { label: "Fri", visitors: 25120, searches: 14200, signups: 441 },
  { label: "Sat", visitors: 28960, searches: 16340, signups: 508 },
  { label: "Sun", visitors: 24380, searches: 13780, signups: 421 }
];

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<AdminListing[]>(() => seedListings());
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = getStoredDashboardState();
    const merged = mergeListings(stored?.listings);
    const mergedUsers = stored?.users?.length ? stored.users : buildUsers(merged);
    setListings(merged);
    setUsers(mergedUsers);
    setAuditLogs(stored?.auditLogs?.length ? stored.auditLogs : buildAuditLogs(merged, mergedUsers));
    setIsReady(true);
  }, []);

  const recordAudit = useCallback((action: string, target: string, detail: string, severity: AuditLog["severity"] = "Info") => {
    setAuditLogs((current) => {
      const next = [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          action,
          actor: "Super Admin",
          target,
          detail,
          createdAt: getTimestampLabel(),
          severity
        },
        ...current
      ].slice(0, 80);
      saveAuditLogs(next);
      return next;
    });
  }, []);

  const updateListings = useCallback((updater: (current: AdminListing[]) => AdminListing[]) => {
    setListings((current) => {
      const next = updater(current);
      saveListings(next);
      return next;
    });
  }, []);

  const approveListing = useCallback(
    (slug: string) => {
      const target = listings.find((listing) => listing.slug === slug)?.name ?? slug;
      updateListings((current) =>
        current.map((listing) =>
          listing.slug === slug
            ? {
                ...listing,
                approvalStatus: "Approved",
                visibility: "Live",
                verified: true,
                completeness: Math.max(listing.completeness, 90)
              }
            : listing
        )
      );
      recordAudit("Approved business", target, "Business listing was approved and made live.", "Info");
    },
    [listings, recordAudit, updateListings]
  );

  const rejectListing = useCallback(
    (slug: string) => {
      const target = listings.find((listing) => listing.slug === slug)?.name ?? slug;
      updateListings((current) =>
        current.map((listing) =>
          listing.slug === slug
            ? {
                ...listing,
                approvalStatus: "Rejected",
                visibility: "Rejected",
                verified: false
              }
            : listing
        )
      );
      recordAudit("Rejected business", target, "Business listing was rejected and removed from live visibility.", "Warning");
    },
    [listings, recordAudit, updateListings]
  );

  const pauseListing = useCallback(
    (slug: string) => {
      const target = listings.find((listing) => listing.slug === slug)?.name ?? slug;
      updateListings((current) =>
        current.map((listing) => (listing.slug === slug ? { ...listing, visibility: "Paused" } : listing))
      );
      recordAudit("Paused business", target, "Business listing visibility was paused.", "Warning");
    },
    [listings, recordAudit, updateListings]
  );

  const restoreListing = useCallback(
    (slug: string) => {
      const target = listings.find((listing) => listing.slug === slug)?.name ?? slug;
      updateListings((current) =>
        current.map((listing) =>
          listing.slug === slug
            ? {
                ...listing,
                approvalStatus: "Approved",
                visibility: "Live"
              }
            : listing
        )
      );
      recordAudit("Restored business", target, "Business listing was restored to approved live visibility.", "Info");
    },
    [listings, recordAudit, updateListings]
  );

  const deleteListing = useCallback(
    (slug: string) => {
      const target = listings.find((listing) => listing.slug === slug)?.name ?? slug;
      updateListings((current) => current.filter((listing) => listing.slug !== slug));
      recordAudit("Deleted business", target, "Business listing was deleted from super admin state.", "Critical");
    },
    [listings, recordAudit, updateListings]
  );

  const approveAllPending = useCallback(() => {
    const count = listings.filter((listing) => listing.approvalStatus === "Pending").length;
    updateListings((current) =>
      current.map((listing) =>
        listing.approvalStatus === "Pending"
          ? {
              ...listing,
              approvalStatus: "Approved",
              visibility: "Live",
              verified: true,
              completeness: Math.max(listing.completeness, 90)
            }
          : listing
      )
    );
    recordAudit("Bulk approved pending businesses", `${count} listings`, "All pending business submissions were approved.", "Info");
  }, [listings, recordAudit, updateListings]);

  const rejectLowCompleteness = useCallback(
    (threshold: number) => {
      const count = listings.filter((listing) => listing.approvalStatus === "Pending" && listing.completeness < threshold).length;
      updateListings((current) =>
        current.map((listing) =>
          listing.approvalStatus === "Pending" && listing.completeness < threshold
            ? {
                ...listing,
                approvalStatus: "Rejected",
                visibility: "Rejected",
                verified: false
              }
            : listing
        )
      );
      recordAudit("Rejected incomplete submissions", `${count} listings`, `Pending businesses under ${threshold}% completeness were rejected.`, "Warning");
    },
    [listings, recordAudit, updateListings]
  );

  const pauseAllListings = useCallback(() => {
    updateListings((current) => current.map((listing) => ({ ...listing, visibility: "Paused" })));
    recordAudit("Paused all businesses", `${listings.length} listings`, "All directory business listings were paused from super admin controls.", "Critical");
  }, [listings.length, recordAudit, updateListings]);

  const restoreAllListings = useCallback(() => {
    updateListings((current) =>
      current.map((listing) =>
        listing.approvalStatus === "Rejected"
          ? listing
          : {
              ...listing,
              approvalStatus: "Approved",
              visibility: "Live"
            }
      )
    );
    recordAudit("Restored all non-rejected businesses", `${listings.length} listings`, "All non-rejected business listings were restored to live visibility.", "Info");
  }, [listings.length, recordAudit, updateListings]);

  const updateUsers = useCallback((updater: (current: AdminUser[]) => AdminUser[]) => {
    setUsers((current) => {
      const next = updater(current);
      saveUsers(next);
      return next;
    });
  }, []);

  const addUser = useCallback(
    (user: AdminUserInput) => {
      const idBase = user.email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "user";
      updateUsers((current) => [
        {
          ...user,
          id: `${idBase}-${Date.now()}`
        },
        ...current
      ]);
      recordAudit("Added user", user.email, `${user.name} was created with ${user.role} access.`, "Info");
    },
    [recordAudit, updateUsers]
  );

  const updateUser = useCallback(
    (id: string, user: AdminUserInput) => {
      updateUsers((current) => current.map((existing) => (existing.id === id ? { ...user, id } : existing)));
      recordAudit("Updated user", user.email, `${user.name} profile, role or status was updated.`, "Info");
    },
    [recordAudit, updateUsers]
  );

  const deleteUser = useCallback(
    (id: string) => {
      const target = users.find((user) => user.id === id);
      updateUsers((current) => current.filter((user) => user.id !== id));
      recordAudit("Deleted user", target?.email ?? id, `${target?.name ?? "User"} was removed from the admin user list.`, "Critical");
    },
    [recordAudit, updateUsers, users]
  );

  const suspendUser = useCallback(
    (id: string) => {
      const target = users.find((user) => user.id === id);
      updateUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, status: "Suspended" } : user))
      );
      recordAudit("Suspended user", target?.email ?? id, `${target?.name ?? "User"} was suspended.`, "Warning");
    },
    [recordAudit, updateUsers, users]
  );

  const restoreUser = useCallback(
    (id: string) => {
      const target = users.find((user) => user.id === id);
      updateUsers((current) => current.map((user) => (user.id === id ? { ...user, status: "Active" } : user)));
      recordAudit("Restored user", target?.email ?? id, `${target?.name ?? "User"} was restored to active status.`, "Info");
    },
    [recordAudit, updateUsers, users]
  );

  const suspendWatchlistUsers = useCallback(() => {
    const count = users.filter((user) => user.status === "Watchlist").length;
    updateUsers((current) => current.map((user) => (user.status === "Watchlist" ? { ...user, status: "Suspended" } : user)));
    recordAudit("Suspended watchlist users", `${count} users`, "All watchlist users were moved to suspended status.", "Warning");
  }, [recordAudit, updateUsers, users]);

  const restoreAllUsers = useCallback(() => {
    const count = users.filter((user) => user.status === "Suspended").length;
    updateUsers((current) => current.map((user) => ({ ...user, status: "Active" })));
    recordAudit("Restored all users", `${count} suspended users`, "All suspended users were restored to active status.", "Info");
  }, [recordAudit, updateUsers, users]);

  const clearAuditLogs = useCallback(() => {
    const next = [
      {
        id: `audit-cleared-${Date.now()}`,
        action: "Cleared audit log",
        actor: "Super Admin",
        target: "Audit history",
        detail: "Audit history was cleared and restarted with this record.",
        createdAt: getTimestampLabel(),
        severity: "Warning" as const
      }
    ];
    setAuditLogs(next);
    saveAuditLogs(next);
  }, []);

  const value = useMemo<SuperAdminContextValue>(() => {
    const pending = listings.filter((listing) => listing.approvalStatus === "Pending").length;
    const approved = listings.filter((listing) => listing.approvalStatus === "Approved").length;
    const rejected = listings.filter((listing) => listing.approvalStatus === "Rejected").length;
    const reviews = listings.reduce((total, listing, index) => total + 18 + index * 11, 0);
    const businessViews = listings
      .map((listing, index) => ({
        ...listing,
        views: 4200 + index * 835 + (listing.visibility === "Live" ? 1200 : 0),
        calls: 64 + index * 17,
        directions: 42 + index * 13,
        owner: listing.ownerName || `${listing.name} Team`
      }))
      .sort((a, b) => b.views - a.views);

    return {
      isReady,
      listings,
      users,
      referrals,
      traffic,
      businessViews,
      auditLogs,
      recordAudit,
      totals: {
        businesses: listings.length,
        approved,
        pending,
        rejected,
        users: users.length + 28462,
        visitorsToday: traffic[traffic.length - 1].visitors,
        searchesToday: traffic[traffic.length - 1].searches,
        reviews
      },
      approveListing,
      rejectListing,
      pauseListing,
      restoreListing,
      deleteListing,
      approveAllPending,
      rejectLowCompleteness,
      pauseAllListings,
      restoreAllListings,
      addUser,
      updateUser,
      deleteUser,
      suspendUser,
      restoreUser,
      suspendWatchlistUsers,
      restoreAllUsers,
      clearAuditLogs
    };
  }, [
    approveListing,
    addUser,
    auditLogs,
    approveAllPending,
    clearAuditLogs,
    deleteUser,
    deleteListing,
    isReady,
    listings,
    pauseListing,
    pauseAllListings,
    rejectListing,
    rejectLowCompleteness,
    recordAudit,
    restoreListing,
    restoreAllListings,
    restoreUser,
    restoreAllUsers,
    suspendUser,
    suspendWatchlistUsers,
    updateUser,
    users
  ]);

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>;
}

export function useSuperAdminData() {
  const context = useContext(SuperAdminContext);

  if (!context) {
    throw new Error("useSuperAdminData must be used inside SuperAdminProvider.");
  }

  return context;
}
