import AdminField from "./AdminField";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CustomerInfo({ customer }) {
  return (
    <section className="space-y-4">
      <h2 className="subsection-title">Customer information</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminField
          label="Name"
          value={[customer?.firstName, customer?.lastName]
            .filter(Boolean)
            .join(" ")}
        />
        <AdminField label="Date of birth" value={formatDate(customer?.dateOfBirth)} />
        <AdminField label="Gender" value={customer?.gender} />
        <AdminField label="PAN" value={customer?.panNumber} />
        <AdminField label="Aadhaar" value={customer?.aadhaarNumber} />
      </div>
    </section>
  );
}

export default CustomerInfo;
