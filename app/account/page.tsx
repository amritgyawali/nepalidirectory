"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardPageFrame } from "@/components/dashboard/DashboardPageFrame";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useDashboardData } from "@/components/dashboard/DashboardProvider";
import { routes } from "@/lib/routes";

type AccountSection = "profile" | "hours" | "settings";

export default function AccountPage() {
  return (
    <DashboardShell>
      <AccountPageContent />
    </DashboardShell>
  );
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, saveProfile, selectListing, updateListingHours } = useDashboardData();
  const rawSection = searchParams.get("section");
  const requestedSection: AccountSection =
    rawSection === "hours" || rawSection === "settings" || rawSection === "profile" ? rawSection : "profile";
  const requestedListing = searchParams.get("listing");
  const activeListing =
    state.listings.find((listing) => listing.slug === (requestedListing ?? state.selectedListingSlug)) ??
    state.listings[0];
  const [savedMessage, setSavedMessage] = useState("");
  const [profileForm, setProfileForm] = useState(state.profile);

  useEffect(() => {
    setProfileForm(state.profile);
  }, [state.profile]);

  useEffect(() => {
    if (requestedListing && requestedListing !== state.selectedListingSlug) {
      selectListing(requestedListing);
    }
  }, [requestedListing, selectListing, state.selectedListingSlug]);

  useEffect(() => {
    setProfileForm((current) => ({
      ...current,
      hours: activeListing.hours
    }));
  }, [activeListing.hours]);

  const sections = useMemo(
    () => [
      ["profile", "Profile"],
      ["hours", "Hours & Info"],
      ["settings", "Settings"]
    ] as const,
    []
  );

  function updateRoute(section: AccountSection, listingSlug: string) {
    router.replace(`${routes.account}?section=${section}&listing=${listingSlug}`, { scroll: false });
  }

  return (
    <DashboardPageFrame>
      <section className="dashboard-heading">
        <div>
          <h1>Hours, info and settings</h1>
          <p>Manage contact details, operating hours, and notification preferences across the dashboard.</p>
        </div>
        <div className="dashboard-head-actions">
          <select
            onChange={(event) => {
              const listingSlug = event.target.value;
              selectListing(listingSlug);
              updateRoute(requestedSection, listingSlug);
            }}
            value={activeListing.slug}
          >
            {state.listings.map((listing) => (
              <option key={listing.slug} value={listing.slug}>
                {listing.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="dashboard-filter-row">
        {sections.map(([section, label]) => (
          <button
            className={`chip ${requestedSection === section ? "chip--active" : ""}`}
            key={section}
            onClick={() => updateRoute(section, activeListing.slug)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {savedMessage ? <div className="success-note">{savedMessage}</div> : null}

      {requestedSection === "profile" ? (
        <section className="dashboard-panel dashboard-form-panel">
          <div className="dashboard-panel__head">
            <h2>Profile details</h2>
          </div>
          <form
            className="dashboard-form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              saveProfile(profileForm);
              setSavedMessage("Profile details saved.");
            }}
          >
            <label>
              <span>Full name</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    fullName: event.target.value
                  }))
                }
                value={profileForm.fullName}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    email: event.target.value
                  }))
                }
                type="email"
                value={profileForm.email}
              />
            </label>
            <label>
              <span>Default location</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    location: event.target.value
                  }))
                }
                value={profileForm.location}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    phone: event.target.value
                  }))
                }
                value={profileForm.phone}
              />
            </label>
            <label className="dashboard-form-grid__wide">
              <span>Website</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    website: event.target.value
                  }))
                }
                value={profileForm.website}
              />
            </label>
            <button className="button button--primary" type="submit">
              Save profile
            </button>
          </form>
        </section>
      ) : null}

      {requestedSection === "hours" ? (
        <section className="dashboard-panel dashboard-form-panel">
          <div className="dashboard-panel__head">
            <h2>{activeListing.name} hours and public info</h2>
          </div>
          <form
            className="dashboard-form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              updateListingHours(activeListing.slug, profileForm.hours);
              saveProfile(profileForm);
              setSavedMessage(`${activeListing.name} hours updated.`);
            }}
          >
            <label className="dashboard-form-grid__wide">
              <span>Business hours</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    hours: event.target.value
                  }))
                }
                value={profileForm.hours}
              />
            </label>
            <label>
              <span>Location</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    location: event.target.value
                  }))
                }
                value={profileForm.location}
              />
            </label>
            <label>
              <span>Business phone</span>
              <input
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    phone: event.target.value
                  }))
                }
                value={profileForm.phone}
              />
            </label>
            <button className="button button--primary" type="submit">
              Save hours & info
            </button>
          </form>
        </section>
      ) : null}

      {requestedSection === "settings" ? (
        <section className="dashboard-panel dashboard-form-panel">
          <div className="dashboard-panel__head">
            <h2>Notification preferences</h2>
          </div>
          <form
            className="dashboard-settings-list"
            onSubmit={(event) => {
              event.preventDefault();
              saveProfile(profileForm);
              setSavedMessage("Settings saved.");
            }}
          >
            <label>
              <input
                checked={profileForm.notifications.emailLeads}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    notifications: {
                      ...current.notifications,
                      emailLeads: event.target.checked
                    }
                  }))
                }
                type="checkbox"
              />
              <span>Email me when a new lead calls or requests directions.</span>
            </label>
            <label>
              <input
                checked={profileForm.notifications.reviewAlerts}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    notifications: {
                      ...current.notifications,
                      reviewAlerts: event.target.checked
                    }
                  }))
                }
                type="checkbox"
              />
              <span>Notify me when a new review needs a public reply.</span>
            </label>
            <label>
              <input
                checked={profileForm.notifications.weeklyDigest}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    notifications: {
                      ...current.notifications,
                      weeklyDigest: event.target.checked
                    }
                  }))
                }
                type="checkbox"
              />
              <span>Send me a weekly performance digest.</span>
            </label>
            <button className="button button--primary" type="submit">
              Save settings
            </button>
          </form>
        </section>
      ) : null}
    </DashboardPageFrame>
  );
}
