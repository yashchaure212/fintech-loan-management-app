import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  useGetProfileQuery,
  useGetAddressQuery,
} from "@/features/profile/api/profileApi";

import ProfileProgress from "@/features/profile/components/ProfileProgress";
import PersonalDetails from "@/features/profile/components/PersonalDetails";
import AddressDetails from "@/features/profile/components/AddressDetails";
import ChangePassword from "@/features/profile/components/ChangePassword";

function Profile() {
  const { data: profileResponse, isLoading: profileLoading } =
    useGetProfileQuery();

  const { data: addressResponse, isLoading: addressLoading } =
    useGetAddressQuery();

  if (profileLoading || addressLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="h-36 animate-pulse rounded-2xl border bg-card" />
          <div className="h-72 animate-pulse rounded-2xl border bg-card" />
          <div className="h-64 animate-pulse rounded-2xl border bg-card" />
          <div className="h-56 animate-pulse rounded-2xl border bg-card" />
        </div>
      </section>
    );
  }

  const profile = profileResponse?.data || {};
  const address = addressResponse?.data?.[0] || {};

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

        {/* PAGE HEADER */}
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="bg-[linear-gradient(135deg,#07182f_0%,#0d2b52_55%,#163f6b_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <UserRound className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Account
                  </span>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Your profile
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                    Manage the personal information and contact details
                    associated with your LoanPro account.
                  </p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
                <ShieldCheck className="h-3.5 w-3.5" />
                Account
              </div>
            </div>
          </div>

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Personal
              </p>
              <p className="mt-1 text-sm font-semibold">
                Personal details
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contact
              </p>
              <p className="mt-1 text-sm font-semibold">
                Address information
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Security
              </p>
              <p className="mt-1 text-sm font-semibold">
                Account password
              </p>
            </div>
          </div>
        </section>

        {/* PROFILE COMPLETION */}
        <section>
          <div className="mb-4">
            <span className="section-eyebrow">Profile status</span>

            <h2 className="section-title mt-2">
              Complete your profile
            </h2>

            <p className="text-helper mt-1">
              Keep your basic personal and address information up to date.
            </p>
          </div>

          <ProfileProgress
            profile={profile}
            address={address}
          />
        </section>

        {/* PERSONAL DETAILS */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Personal information
              </span>

              <h2 className="section-title mt-2">
                Personal details
              </h2>

              <p className="text-helper mt-1">
                Keep your basic personal information accurate.
              </p>
            </div>
          </div>

          <PersonalDetails />
        </section>

        {/* ADDRESS */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Contact information
              </span>

              <h2 className="section-title mt-2">
                Address
              </h2>

              <p className="text-helper mt-1">
                Keep your residential address details up to date.
              </p>
            </div>
          </div>

          <AddressDetails />
        </section>

        {/* PASSWORD */}
        <section className="form-section">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <span className="section-eyebrow">
                Account security
              </span>

              <h2 className="section-title mt-2">
                Password
              </h2>

              <p className="text-helper mt-1">
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          <ChangePassword />
        </section>

        {/* SECURITY NOTE */}
        <section className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Keep your account secure
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Never share your password, OTP, PIN, or other authentication
                credentials with anyone.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Profile;