import React from "react";
import { useRouter } from "next/router";
import { ProfileCommunityTabs } from "@/pages/profile/[user_id]/_components/profile.community.tabs";
import useGetUser from "@/hooks/use.get.user";

interface Props {
  children: React.ReactNode;
}

const ProfileCommunityLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useGetUser(router.query.user_id?.toString());

  return (
    <div>
      <ProfileCommunityTabs user={user} />
      {children}
    </div>
  );
};

export default ProfileCommunityLayout;
