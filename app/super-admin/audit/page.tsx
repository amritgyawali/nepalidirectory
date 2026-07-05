"use client";

import { AlertTriangle, ClipboardList, Download, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuperAdminData } from "@/components/superadmin/SuperAdminProvider";

export default function SuperAdminAuditPage() {
  const { auditLogs, clearAuditLogs, recordAudit } = useSuperAdminData();
  const [severity, setSeverity] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => {
      const needle = query.toLowerCase().trim();
      return auditLogs.filter((log) => {
        const matchesSeverity = severity === "all" || log.severity === severity;
        const matchesQuery =
          !needle || [log.action, log.actor, log.target, log.detail, log.createdAt].join(" ").toLowerCase().includes(needle);
        return matchesSeverity && matchesQuery;
      });
    },
    [auditLogs, query, severity]
  );

  const criticalCount = auditLogs.filter((log) => log.severity === "Critical").length;
  const warningCount = auditLogs.filter((log) => log.severity === "Warning").length;

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>Audit trail</span>
          <h1>Super admin action history</h1>
          <p>Track sensitive account, listing, approval and platform-control actions from the super admin console.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        <article>
          <ClipboardList size={20} aria-hidden />
          <span>Total events</span>
          <strong>{auditLogs.length}</strong>
          <small>Saved locally for review</small>
        </article>
        <article>
          <AlertTriangle size={20} aria-hidden />
          <span>Warnings</span>
          <strong>{warningCount}</strong>
          <small>Moderation attention</small>
        </article>
        <article>
          <ShieldCheck size={20} aria-hidden />
          <span>Critical</span>
          <strong>{criticalCount}</strong>
          <small>Delete or high-risk actions</small>
        </article>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Event log</h2>
          <span>{filtered.length} visible events</span>
        </div>
        <div className="superadmin-filters">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search action, actor, target..." />
          <select onChange={(event) => setSeverity(event.target.value)} value={severity}>
            <option value="all">All severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
          <button onClick={() => recordAudit("Exported audit log", `${filtered.length} events`, "Super admin exported the filtered audit log.", "Info")} type="button">
            <Download size={15} aria-hidden />
            Export audit log
          </button>
          <button onClick={() => recordAudit("Generated incident report", `${criticalCount} critical events`, "Super admin generated an incident report from audit events.", "Warning")} type="button">
            <Search size={15} aria-hidden />
            Incident report
          </button>
          <button data-danger onClick={clearAuditLogs} type="button">
            <Trash2 size={15} aria-hidden />
            Clear log
          </button>
        </div>
        <div className="superadmin-table superadmin-table--audit">
          {filtered.map((log) => (
            <article key={log.id}>
              <div>
                <strong>{log.action}</strong>
                <span>{log.detail}</span>
              </div>
              <span>{log.actor}</span>
              <span>{log.target}</span>
              <span data-status={log.severity}>{log.severity}</span>
              <span>{log.createdAt}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
