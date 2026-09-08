import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  IdCard,
  Info,
  LockKeyhole,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useGetProfileQuery } from "@/features/profile/api/profileApi";

function KYC() {
  const { data, isLoading } = useGetProfileQuery();

  const profile = data?.data || {};

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-2xl border bg-card" />
          <div className="h-44 animate-pulse rounded-2xl border bg-card" />
          <div className="h-72 animate-pulse rounded-2xl border bg-card" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="space-y-6">
        {/* BACK */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        {/* HEADER */}
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="bg-[linear-gradient(135deg,#07182f_0%,#0d2b52_55%,#163f6b_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Verification
                  </span>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    KYC Verification
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                    Verify your identity and address so you can use services
                    that require completed KYC.
                  </p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100">
                <Clock3 className="h-3.5 w-3.5" />
                Verification pending
              </div>
            </div>
          </div>

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 1
              </p>

              <p className="mt-1 text-sm font-semibold">
                Identity details
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 2
              </p>

              <p className="mt-1 text-sm font-semibold">
                Documents
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 3
              </p>

              <p className="text-sm font-semibold mt-1">
                Verification
              </p>
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="section-eyebrow">
                KYC status
              </span>

              <h2 className="section-title mt-2">
                Your verification is not complete
              </h2>

              <p className="text-helper mt-1 max-w-2xl">
                Submit the required identity and address documents to complete
                your KYC verification.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800">
              <Clock3 className="h-4 w-4" />
              Pending
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="financial-label">
                Verification progress
              </span>

              <span className="text-caption">
                0 of 3 completed
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
          </div>
        </section>

        {/* IDENTITY DETAILS */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Identity information
              </span>

              <h2 className="section-title mt-2">
                Your identity details
              </h2>

              <p className="text-helper mt-1">
                These details are taken from your account profile.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoField
              label="First Name"
              value={profile.firstName}
            />

            <InfoField
              label="Date of Birth"
              value={
                profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString()
                  : "Not provided"
              }
            />

            <InfoField
              label="Gender"
              value={formatValue(profile.gender)}
            />

            <InfoField
              label="Occupation"
              value={profile.occupation || "Not provided"}
            />
          </div>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

              <p className="text-sm leading-6 text-blue-800">
                Make sure your profile information matches your identity
                documents before submitting KYC.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Link
              to="/customer/profile"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Update Profile
            </Link>
          </div>
        </section>

        {/* IDENTITY DOCUMENT */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IdCard className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Identity verification
              </span>

              <h2 className="section-title mt-2">
                Identity document
              </h2>

              <p className="text-helper mt-1">
                Provide the identity information required for verification.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-label">
                PAN Number
              </label>

              <input
                type="text"
                placeholder="Enter PAN number"
                className="mt-2 h-11 w-full rounded-xl border border-default bg-card px-3 text-sm uppercase text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-label">
                Aadhaar / Government ID
              </label>

              <input
                type="text"
                placeholder="Enter ID number"
                className="mt-2 h-11 w-full rounded-xl border border-default bg-card px-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-subtle pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <FileCheck2 className="h-4 w-4" />
              Save Identity Details
            </button>
          </div>
        </section>

        {/* DOCUMENTS */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                KYC documents
              </span>

              <h2 className="section-title mt-2">
                Upload verification documents
              </h2>

              <p className="text-helper mt-1">
                Upload the documents requested for identity and address
                verification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <DocumentUpload
              title="Identity Proof"
              description="Upload an accepted identity document."
              required
            />

            <DocumentUpload
              title="Address Proof"
              description="Upload a document showing your current address."
              required
            />

            <DocumentUpload
              title="Additional Document"
              description="Upload another document only when specifically requested."
            />
          </div>
        </section>

        {/* ADDRESS */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Address verification
              </span>

              <h2 className="section-title mt-2">
                Verify your address
              </h2>

              <p className="text-helper mt-1">
                Your submitted address should match the supporting document
                where required.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField
                label="Address"
                value="Complete address from your profile"
              />

              <InfoField
                label="Pincode"
                value="Your profile pincode"
              />
            </div>

            <Link
              to="/customer/profile"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Review your address
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </section>

        {/* SECURITY */}
        <section className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
              <LockKeyhole className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Keep your identity information safe
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Only upload documents through the secure LoanPro application.
                Never share OTPs, passwords, PINs, or authentication codes with
                anyone.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function DocumentUpload({
  title,
  description,
  required = false,
}) {
  return (
    <div className="rounded-2xl border bg-background p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">
                {title}
              </h3>

              {required && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                  Required
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No document uploaded
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Supported document types will be shown during upload.
        </p>
      </div>
    </div>
  );
}

function formatValue(value) {
  if (!value) return "Not provided";

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default KYC;