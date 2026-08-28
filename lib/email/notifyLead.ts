import "server-only";
import { Resend } from "resend";
import { brand } from "@/lib/brand";

type LeadRow = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  state?: string | null;
  dob?: string | null;
  sex_at_birth?: string | null;
  tobacco?: string | null;
  health_level?: string | null;
  term_length?: number | null;
  coverage_amount?: number | null;
  motivation?: string[] | null;
  who_to_protect?: string[] | null;
  children_count?: number | null;
  consent_at?: string | null;
};

export async function notifyLead(lead: LeadRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "onboarding@resend.dev";
  if (!apiKey || !to) {
    console.warn("[notifyLead] Skipped — RESEND_API_KEY or LEAD_NOTIFICATION_TO not set.");
    return;
  }

  const resend = new Resend(apiKey);
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "New lead";
  const rows: [string, string | number | null | undefined][] = [
    ["Name", name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["State", lead.state],
    ["DOB", lead.dob],
    ["Sex at birth", lead.sex_at_birth],
    ["Tobacco", lead.tobacco],
    ["Health", lead.health_level],
    ["Term (years)", lead.term_length],
    ["Coverage", lead.coverage_amount ? `$${Number(lead.coverage_amount).toLocaleString()}` : null],
    ["Motivation", lead.motivation?.join(", ")],
    ["Protect", lead.who_to_protect?.join(", ")],
    ["Kids under 18", lead.children_count],
    ["Consent at", lead.consent_at],
  ];

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;">
      <h2 style="color:#1f5d42;margin:0 0 6px">New ${brand.name} lead</h2>
      <p style="color:#6a7a74;margin:0 0 16px">${name} — ${lead.state ?? ""}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows.filter(([, v]) => v !== null && v !== undefined && v !== "").map(([k, v]) => `
          <tr>
            <td style="padding:6px 10px;background:#f0fbf5;border:1px solid #dcf5e7;color:#1f5d42;font-weight:600;width:40%">${k}</td>
            <td style="padding:6px 10px;border:1px solid #dcf5e7">${String(v)}</td>
          </tr>`).join("")}
      </table>
      <p style="color:#6a7a74;font-size:12px;margin-top:16px">
        Lead ID: ${lead.id}
      </p>
    </div>`;

  await resend.emails.send({
    from,
    to,
    subject: `New ${brand.name} lead: ${name}${lead.state ? ` — ${lead.state}` : ""}`,
    html,
  });
}
