import React from "react";
import { ProfileCommunityTabs } from "@/pages/profile/[user_id]/_components/profile.community.tabs";

interface Props {
  children: React.ReactNode;
}

const ProfileCommunityLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <ProfileCommunityTabs />
      {children}
    </div>
  );
};

export default ProfileCommunityLayout;
