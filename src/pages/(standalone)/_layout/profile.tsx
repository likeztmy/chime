import { ProfileCard } from "@/feature/user/components/profile-card";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(standalone)/_layout/profile")({
  component: ProfilePage,
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    const redirectUrl = localStorage.getItem("redirect_url");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }

    if (redirectUrl && redirectUrl !== "/profile") {
      throw redirect({
        to: "/welcome",
      });
    }
  },
});

function ProfilePage() {
  return (
    <div className="w-full lg:max-w-xl">
      <ProfileCard />
    </div>
  );
}
