import AdminField from "./AdminField";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFullName(customer) {
  return (
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") || "-"
  );
}

function CustomerInfo({ customer }) {
  if (!customer) {
    return null;
  }

  return (
    <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      <AdminField label="Full name" value={getFullName(customer)} emphasize />

      <AdminField
        label="Date of birth"
        value={formatDate(customer.dateOfBirth)}
      />

      <AdminField label="Gender" value={customer.gender} />

      <AdminField label="PAN" value={customer.panNumber} />

      <AdminField label="Aadhaar" value={customer.aadhaarNumber} />
    </div>
  );
}

export default CustomerInfo;
