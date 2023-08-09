import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "@/pages/profile/[user_id]/_components";
import { ProfileCommunityTabs } from "@/pages/profile/[user_id]/_components/profile.community.tabs";
import useGetUser from "@/hooks/use.get.user";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}
const ProfileCommunityLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useGetUser(router.query.user_id?.toString());
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
        <ProfileCommunityTabs user={user} />
        {children}
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default ProfileCommunityLayout;
