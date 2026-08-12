import {
  useGetProfileQuery,
  useGetAddressQuery,
} from "@/features/profile/api/profileApi";

import ProfileProgress from "@/features/profile/components/ProfileProgress";
import PersonalDetails from "@/features/profile/components/PersonalDetails";
import AddressDetails from "@/features/profile/components/AddressDetails";

function Profile() {
  const { data: profileResponse, isLoading: profileLoading } =
    useGetProfileQuery();

  const { data: addressResponse, isLoading: addressLoading } =
    useGetAddressQuery();

  if (profileLoading || addressLoading) {
    return (
      <section className="max-w-5xl mx-auto">
        <div className="py-20 text-center">Loading profile...</div>
      </section>
    );
  }

  const profile = profileResponse?.data || {};
  const address = addressResponse?.data?.[0] || {};

  return (
    <section className="max-w-5xl mx-auto py-6">
      <div className="space-y-6">
        {/* Progress */}

        <ProfileProgress profile={profile} address={address} />

        {/* Personal */}

        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Personal Details</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Update your personal information.
            </p>
          </div>

          <PersonalDetails />
        </div>

        {/* Address */}

        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Address</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Update your current address.
            </p>
          </div>

          <AddressDetails />
        </div>
      </div>
    </section>
  );
}

export default Profile;
