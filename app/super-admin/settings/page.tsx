"use client";

import { BellRing, DatabaseBackup, Download, KeyRound, LockKeyhole, RadioTower, Save, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

const switches = [
  ["maintenance", "Maintenance mode", "Temporarily show platform maintenance state."],
  ["lockSignups", "Lock new signups", "Stop new user accounts while reviewing abuse."],
  ["ownerVerification", "Require owner verification", "Force owner email verification before publishing."],
  ["reviewHold", "Hold new reviews", "Queue reviews for moderation before display."],
  ["referralCapture", "Referral capture", "Track source website and campaign performance."],
  ["securityAlerts", "Security alerts", "Notify super admin for risky actions."]
] as const;

const toolGroups = [
  {
    title: "Data and export tools",
    icon: DatabaseBackup,
    tools: ["Export all users", "Export businesses", "Export referral report", "Export audit log", "Create local backup snapshot"]
  },
  {
    title: "Access tools",
    icon: KeyRound,
    tools: ["Rotate super admin session", "Force logout all admins", "Reset editor access", "Review suspended users"]
  },
  {
    title: "Moderation tools",
    icon: ShieldAlert,
    tools: ["Bulk reject duplicates", "Freeze listing approvals", "Hide reported businesses", "Review owner claims"]
  },
  {
    title: "Notification tools",
    icon: BellRing,
    tools: ["Send owner announcement", "Notify pending businesses", "Alert editors", "Create incident message"]
  }
];

export default function SuperAdminSettingsPage() {
  const { totals, recordAudit, suspendWatchlistUsers, restoreAllUsers } = useSuperAdminData();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    maintenance: false,
    lockSignups: false,
    ownerVerification: true,
    reviewHold: true,
    referralCapture: true,
    securityAlerts: true
  });
  const [lastSaved, setLastSaved] = useState("Not saved this session");

  const activeCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);

  function toggle(key: string) {
    setEnabled((current) => ({ ...current, [key]: !current[key] }));
  }

  function saveSettings() {
    setLastSaved(new Date().toLocaleTimeString());
    recordAudit("Saved system settings", `${activeCount} switches enabled`, "Super admin saved platform-wide settings.", "Info");
  }

  function runSettingsTool(tool: string) {
    if (tool === "Review suspended users") {
      restoreAllUsers();
    }
    if (tool === "Reset editor access") {
      suspendWatchlistUsers();
    }
    recordAudit("Ran settings tool", tool, `${tool} was executed from system settings.`, tool.includes("Force") ? "Warning" : "Info");
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>System settings</span>
          <h1>Platform-wide admin tools</h1>
          <p>Control security, publishing, notification, backup and emergency behaviors for Nepali Directory.</p>
        </div>
      </div>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>System switches</h2>
          <span>{activeCount} switches enabled</span>
        </div>
        <div className="superadmin-switch-grid superadmin-switch-grid--wide">
          {switches.map(([key, label, detail]) => (
            <button className={enabled[key] ? "is-on" : ""} key={key} onClick={() => toggle(key)} type="button">
              <LockKeyhole size={18} aria-hidden />
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
              <em>{enabled[key] ? "On" : "Off"}</em>
            </button>
          ))}
        </div>
        <div className="superadmin-form-actions">
          <button className="button button--primary" onClick={saveSettings} type="button">
            <Save size={15} aria-hidden />
            Save settings
          </button>
          <button className="button button--outline" onClick={() => recordAudit("Exported settings", "System settings", "Super admin exported current switch configuration.", "Info")} type="button">
            <Download size={15} aria-hidden />
            Export settings
          </button>
        </div>
        <div className="superadmin-inline-stats">
          <span>Last saved: {lastSaved}</span>
          <span>Security alerts: {enabled.securityAlerts ? "active" : "off"}</span>
          <span>Signup lock: {enabled.lockSignups ? "enabled" : "disabled"}</span>
        </div>
      </section>

      <section className="superadmin-control-grid">
        {toolGroups.map((group) => {
          const Icon = group.icon;
          return (
            <article className="superadmin-panel" key={group.title}>
              <div className="superadmin-panel__head">
                <h2>{group.title}</h2>
                <Icon size={20} aria-hidden />
              </div>
              <div className="superadmin-control-list">
                {group.tools.map((tool) => (
                  <button key={tool} onClick={() => runSettingsTool(tool)} type="button">
                    <RadioTower size={15} aria-hidden />
                    {tool}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Current platform scope</h2>
          <span>Live overview</span>
        </div>
        <div className="superadmin-inline-stats">
          <span>{totals.businesses} businesses</span>
          <span>{totals.users.toLocaleString()} users</span>
          <span>{totals.pending} pending approvals</span>
          <span>{totals.visitorsToday.toLocaleString()} visitors today</span>
        </div>
      </section>
    </>
  );
}
