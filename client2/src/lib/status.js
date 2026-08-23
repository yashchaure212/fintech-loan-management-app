export const STATUS_TONES = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  destructive: "destructive",
};

export const LOAN_STATUSES = {
  DRAFT: { label: "Draft", tone: STATUS_TONES.neutral },
  SUBMITTED: { label: "Submitted", tone: STATUS_TONES.info },
  UNDER_REVIEW: { label: "Under Review", tone: STATUS_TONES.warning },
  APPROVED: { label: "Approved", tone: STATUS_TONES.success },
  REJECTED: { label: "Rejected", tone: STATUS_TONES.destructive },
  DISBURSED: { label: "Disbursed", tone: STATUS_TONES.info },
  CLOSED: { label: "Closed", tone: STATUS_TONES.neutral },
};

export const DOCUMENT_STATUSES = {
  PENDING: { label: "Pending", tone: STATUS_TONES.warning },
  VERIFIED: { label: "Verified", tone: STATUS_TONES.success },
  REJECTED: { label: "Rejected", tone: STATUS_TONES.destructive },
};

export const EMI_STATUSES = {
  PENDING: { label: "Pending", tone: STATUS_TONES.warning },
  PARTIALLY_PAID: { label: "Partially Paid", tone: STATUS_TONES.warning },
  PAID: { label: "Paid", tone: STATUS_TONES.success },
  OVERDUE: { label: "Overdue", tone: STATUS_TONES.destructive },
};

const STATUS_MAPS = {
  loan: LOAN_STATUSES,
  document: DOCUMENT_STATUSES,
  emi: EMI_STATUSES,
};

function formatStatusLabel(status) {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function getStatusConfig(status, type) {
  if (!status) {
    return {
      label: "Unknown",
      tone: STATUS_TONES.neutral,
    };
  }

  if (type && STATUS_MAPS[type]?.[status]) {
    return STATUS_MAPS[type][status];
  }

  if (LOAN_STATUSES[status]) {
    return LOAN_STATUSES[status];
  }

  if (DOCUMENT_STATUSES[status]) {
    return DOCUMENT_STATUSES[status];
  }

  if (EMI_STATUSES[status]) {
    return EMI_STATUSES[status];
  }

  return {
    label: formatStatusLabel(status),
    tone: STATUS_TONES.neutral,
  };
}
