import { UserRound } from "lucide-react";

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
        <div className="app-card min-h-48 animate-pulse" />
      </section>
    );
  }

  const profile = profileResponse?.data || {};
  const address = addressResponse?.data?.[0] || {};

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="page-header-card">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <span className="section-eyebrow">Account</span>

              <h1 className="page-title mt-3">Your profile</h1>

              <p className="mt-1 text-helper">
                Keep your personal information and address details up to date.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE COMPLETION */}
        <ProfileProgress profile={profile} address={address} />

        {/* PERSONAL DETAILS */}
        <div className="form-section">
          <div className="mb-6">
            <span className="section-eyebrow">Personal information</span>

            <h2 className="section-title mt-3">Personal details</h2>

            <p className="text-helper mt-1">
              Update your personal information.
            </p>
          </div>

          <PersonalDetails />
        </div>

        {/* ADDRESS */}
        <div className="form-section">
          <div className="mb-6">
            <span className="section-eyebrow">Contact information</span>

            <h2 className="section-title mt-3">Address</h2>

            <p className="text-helper mt-1">Update your current address.</p>
          </div>

          <AddressDetails />
        </div>

        {/* PASSWORD */}
        <div className="form-section">
          <div className="mb-6">
            <span className="section-eyebrow">Security</span>

            <h2 className="section-title mt-3">Password</h2>

            <p className="text-helper mt-1">
              Changing your password signs you out of this device.
            </p>
          </div>

          <ChangePassword />
        </div>
      </div>
    </section>
  );
}

export default Profile;
