import { getSession } from "@/lib/auth/session";
import { findProfileById } from "@/lib/repositories/customers";
import { ProfileForm } from "./ui";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  const profile = session ? findProfileById(session.userId) : null;
  return (
    <div>
      <h1 className="font-serif text-4xl">Profile</h1>
      <p className="mt-2 text-sm text-ink-soft">Role is server-assigned. You cannot promote yourself to admin.</p>
      {profile && <ProfileForm name={profile.full_name} phone={profile.phone ?? ""} email={profile.email} />}
    </div>
  );
}
