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

  const hasPan = Boolean(profile.panNumber);
  const hasAadhaar = Boolean(profile.aadhaarNumber);

  const completedDocuments = [hasPan, hasAadhaar].filter(Boolean).length;
  const progress = (completedDocuments / 2) * 100;
  const isComplete = completedDocuments === 2;

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
                    Verify your identity once to use LoanPro services that
                    require completed KYC.
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isComplete
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                    : "border-amber-300/20 bg-amber-300/10 text-amber-100"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Clock3 className="h-3.5 w-3.5" />
                )}

                {isComplete ? "KYC completed" : "Verification pending"}
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 1
              </p>

              <p className="mt-1 text-sm font-semibold">
                Profile information
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 2
              </p>

              <p className="mt-1 text-sm font-semibold">
                KYC documents
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step 3
              </p>

              <p className="mt-1 text-sm font-semibold">
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
                {isComplete
                  ? "Your KYC information is complete"
                  : "Complete your KYC verification"}
              </h2>

              <p className="text-helper mt-1 max-w-2xl">
                {isComplete
                  ? "Your PAN and Aadhaar information has been provided."
                  : "Provide the required identity information and documents to complete your profile KYC."}
              </p>
            </div>

            <div
              className={`flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                isComplete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Clock3 className="h-4 w-4" />
              )}

              {isComplete ? "Completed" : "Pending"}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="financial-label">
                KYC progress
              </span>

              <span className="text-caption">
                {completedDocuments} of 2 completed
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* PROFILE INFORMATION */}
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
                Your profile information
              </h2>

              <p className="text-helper mt-1">
                These details are taken from your customer profile.
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
                  ? new Date(profile.dateOfBirth).toLocaleDateString(
                      "en-IN",
                    )
                  : "Not provided"
              }
            />

            <InfoField
              label="Gender"
              value={formatValue(profile.gender)}
            />

            <InfoField
              label="Occupation"
              value={profile.occupation}
            />
          </div>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

              <p className="text-sm leading-6 text-blue-800">
                Make sure your profile information matches the information on
                your KYC documents.
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

        {/* KYC DOCUMENTS */}
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
                KYC documents
              </h2>

              <p className="text-helper mt-1">
                Provide your PAN and Aadhaar documents to verify your identity.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <KYCDocument
              title="PAN Card"
              description="Upload a clear copy of your PAN card."
              value={profile.panNumber}
              completed={hasPan}
              required
            />

            <KYCDocument
              title="Aadhaar Card"
              description="Upload a clear copy of your Aadhaar card."
              value={profile.aadhaarNumber}
              completed={hasAadhaar}
              required
            />
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

function KYCDocument({
  title,
  description,
  value,
  completed,
  required = false,
}) {
  return (
    <div className="rounded-2xl border bg-background p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              completed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <IdCard className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">
                {title}
              </h3>

              {required && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                  Required
                </span>
              )}

              {completed && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Provided
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>

            {value && (
              <p className="mt-2 text-xs font-semibold text-foreground">
                {maskDocumentNumber(value)}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
        >
          {completed ? (
            <>
              <FileCheck2 className="h-4 w-4" />
              View
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </button>
      </div>

      {!completed && (
        <div className="mt-4 rounded-xl border border-dashed bg-muted/20 px-4 py-5 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No document uploaded
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Upload a clear and readable document.
          </p>
        </div>
      )}
    </div>
  );
}

function maskDocumentNumber(value) {
  if (!value) return "";

  if (value.length <= 4) {
    return value;
  }

  return `${value.slice(0, 2)}${"•".repeat(
    Math.max(0, value.length - 4),
  )}${value.slice(-2)}`;
}

function formatValue(value) {
  if (!value) return "Not provided";

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default KYC;