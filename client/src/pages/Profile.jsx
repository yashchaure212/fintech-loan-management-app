import { UserRound } from "lucide-react";
import { useGetProfileQuery, useGetAddressQuery } from "@/features/profile/api/profileApi";
import ProfileProgress from "@/features/profile/components/ProfileProgress";
import PersonalDetails from "@/features/profile/components/PersonalDetails";
import AddressDetails from "@/features/profile/components/AddressDetails";

function Profile() {
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileQuery();
  const { data: addressResponse, isLoading: addressLoading } = useGetAddressQuery();

  if (profileLoading || addressLoading) {
    return <section className="max-w-5xl mx-auto py-8"><div className="h-48 animate-pulse rounded-2xl bg-card" /></section>;
  }

  const profile = profileResponse?.data || {};
  const address = addressResponse?.data?.[0] || {};

  return (
    <section className="mx-auto max-w-5xl py-2">
      <div className="space-y-6">
        <div className="page-header-card">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><UserRound /></span>
            <div>
              <span className="section-eyebrow">Account</span>
              <h1 className="page-title mt-3">Your profile</h1>
              <p className="mt-1 text-helper">Keep your personal information and address details up to date.</p>
            </div>
          </div>
        </div>

        <ProfileProgress profile={profile} address={address} />

        <div className="form-section">
          <div className="mb-6">
            <span className="section-eyebrow">Personal information</span>
            <h2 className="mt-3 text-xl font-bold">Personal details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>
          </div>
          <PersonalDetails />
        </div>

        <div className="form-section">
          <div className="mb-6">
            <span className="section-eyebrow">Contact information</span>
            <h2 className="mt-3 text-xl font-bold">Address</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update your current address.</p>
          </div>
          <AddressDetails />
        </div>
      </div>
    </section>
  );
}

export default Profile;
