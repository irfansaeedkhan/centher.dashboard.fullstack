import React from "react";
import { useRouter } from "next/router";
import { ProfileNFTCollectionTabs } from "@/pages/profile/[user_id]/_components/profile.nft.collection.tabs";
import useGetUser from "@/hooks/use.get.user";

interface Props {
  children: React.ReactNode;
}
const ProfileNftsLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useGetUser(router.query.user_id?.toString());

  return user ? (
    <div>
      <ProfileNFTCollectionTabs user={user} />
      {children}
    </div>
  ) : null;
};

export default ProfileNftsLayout;
