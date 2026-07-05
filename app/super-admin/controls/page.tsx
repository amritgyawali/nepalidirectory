"use client";

import { Activity, DatabaseBackup, LockKeyhole, ShieldCheck, Siren, ToggleLeft } from "lucide-react";
import { useState } from "react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

const controlGroups = [
  {
    title: "Listing governance",
    icon: ShieldCheck,
    tools: [
      "Require super admin approval before publishing new businesses",
      "Auto-flag duplicate phone numbers and URLs",
      "Block rejected listings from search and sitemap surfaces",
      "Require verified owner email before featured placement"
    ]
  },
  {
    title: "Security controls",
    icon: LockKeyhole,
    tools: [
      "Super admin-only access to platform controls",
      "Session gate before dashboard render",
      "Noindex super admin routes",
      "Audit sensitive approve/reject/delete actions"
    ]
  },
  {
    title: "Incident tools",
    icon: Siren,
    tools: [
      "Pause all new listing submissions",
      "Hide suspicious business categories",
      "Freeze review publishing queue",
      "Export affected listing IDs for investigation"
    ]
  },
  {
    title: "Data tools",
    icon: DatabaseBackup,
    tools: [
      "Export business list report",
      "Export users and owners report",
      "Export referral summary",
      "Synchronize local owner dashboard state"
    ]
  }
];

export default function SuperAdminControlsPage() {
  const { totals, recordAudit, pauseAllListings, restoreAllListings } = useSuperAdminData();
  const [lastRun, setLastRun] = useState("No tool has been executed yet.");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    approvals: true,
    moderation: true,
    referrals: true,
    ownerTools: true,
    emergencyFreeze: false
  });

  function toggle(key: string) {
    setEnabled((current) => ({ ...current, [key]: !current[key] }));
    recordAudit("Toggled platform switch", key, `${key} was toggled from controls.`, "Info");
  }

  function runTool(tool: string) {
    setLastRun(`${tool} completed`);
    recordAudit("Ran control tool", tool, `${tool} was executed from the controls page.`, tool.toLowerCase().includes("freeze") ? "Warning" : "Info");
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Power controls</span>
          <h1>Platform tools and safety switches</h1>
          <p>Super admin can control publishing, moderation, analytics and emergency operating modes across Nepali Directory.</p>
        </div>
      </div>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Live platform switches</h2>
          <span>{totals.pending} items currently need approval</span>
        </div>
        <div className="superadmin-switch-grid">
          {[
            ["approvals", "Require business approval"],
            ["moderation", "Review moderation queue"],
            ["referrals", "Referral tracking"],
            ["ownerTools", "Owner dashboard tools"],
            ["emergencyFreeze", "Emergency freeze mode"]
          ].map(([key, label]) => (
            <button className={enabled[key] ? "is-on" : ""} key={key} onClick={() => toggle(key)} type="button">
              <ToggleLeft size={18} aria-hidden />
              <span>{label}</span>
              <strong>{enabled[key] ? "On" : "Off"}</strong>
            </button>
          ))}
        </div>
        <div className="superadmin-inline-stats">
          <span>
            <Activity size={14} aria-hidden />
            {lastRun}
          </span>
          <button data-danger onClick={pauseAllListings} type="button">Emergency pause all listings</button>
          <button onClick={restoreAllListings} type="button">Restore listing operations</button>
        </div>
      </section>

      <section className="superadmin-control-grid">
        {controlGroups.map((group) => {
          const Icon = group.icon;
          return (
            <article className="superadmin-panel" key={group.title}>
              <div className="superadmin-panel__head">
                <h2>{group.title}</h2>
                <Icon size={20} aria-hidden />
              </div>
              <div className="superadmin-control-list">
                {group.tools.map((tool) => (
                  <button key={tool} onClick={() => runTool(tool)} type="button">
                    <ShieldCheck size={15} aria-hidden />
                    {tool}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
