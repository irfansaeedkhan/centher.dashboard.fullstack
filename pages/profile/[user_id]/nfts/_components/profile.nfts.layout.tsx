import React from "react";
import { ProfileNFTCollectionTabs } from "@/pages/profile/[user_id]/_components/profile.nft.collection.tabs";

interface Props {
  children: React.ReactNode;
}
const ProfileNftsLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <ProfileNFTCollectionTabs />
      {children}
    </div>
  );
};

export default ProfileNftsLayout;
