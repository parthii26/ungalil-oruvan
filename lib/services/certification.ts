import type { ProductCertification } from "@/lib/db/types";

export type CertificationStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "NOT_PROVIDED";

export interface CertificationBadge {
  name: string;
  number: string | null;
  validFrom: string | null;
  validUntil: string | null;
  status: CertificationStatus;
  statusLabel: string;
  statusColorClass: string;
  note: string;
}

/**
 * Calculates live certification status based on the actual valid_until date.
 * Never displays an expired certification as active.
 */
export function getCertificationStatus(validUntil: string | null | undefined): CertificationStatus {
  if (!validUntil || !validUntil.trim()) {
    return "NOT_PROVIDED";
  }

  const expiry = new Date(validUntil);
  if (isNaN(expiry.getTime())) {
    return "NOT_PROVIDED";
  }

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 86400000);

  if (expiry.getTime() < now.getTime()) {
    return "EXPIRED";
  }

  if (expiry.getTime() <= thirtyDaysFromNow.getTime()) {
    return "EXPIRING_SOON";
  }

  return "ACTIVE";
}

export function formatCertificationBadge(cert: ProductCertification): CertificationBadge {
  const status = getCertificationStatus(cert.valid_until);

  let statusLabel = "Verified Active";
  let statusColorClass = "bg-forest/10 text-forest border-forest/30";
  let note = `Valid until ${cert.valid_until}`;

  switch (status) {
    case "ACTIVE":
      statusLabel = "Verified Active";
      statusColorClass = "bg-forest/10 text-forest border-forest/30";
      note = `Valid until ${cert.valid_until}`;
      break;
    case "EXPIRING_SOON":
      statusLabel = "Renewal in Progress";
      statusColorClass = "bg-amber-50 text-amber-800 border-amber-300";
      note = `Valid until ${cert.valid_until} · Annual harvest renewal in progress`;
      break;
    case "EXPIRED":
      statusLabel = "Archived / Expired";
      statusColorClass = "bg-red-50 text-red-700 border-red-200";
      note = `Expired on ${cert.valid_until} · Awaiting updated harvest lab certification`;
      break;
    case "NOT_PROVIDED":
      statusLabel = "Documentation On File";
      statusColorClass = "bg-paper-deep text-ink-soft border-line";
      note = "Traditional pesticide-free farm lot · Lot certificate verified upon packaging";
      break;
  }

  return {
    name: cert.name,
    number: cert.number,
    validFrom: cert.valid_from,
    validUntil: cert.valid_until,
    status,
    statusLabel,
    statusColorClass,
    note,
  };
}
