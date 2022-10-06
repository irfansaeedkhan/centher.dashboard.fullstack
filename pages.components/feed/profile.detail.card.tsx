// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

import { User } from "@/models/user";
import { useGetUserProfileViews } from "@/hooks/user.profile.views";
import Image from "next/future/image";

interface ProfileDetailCardProps {
  user: User;
  isLoggedInUser: boolean;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
  isLoggedInUser,
}) => {
  const { userProfileViews } = useGetUserProfileViews();

  return (
    <div className={profileDetailCard}>
      <Image
        src="/images/feedprofilepic.png"
        className={profilePic}
        alt="profle pic"
        width={60}
        height={60}
      />
      <h3 className={profileName}>{user.display_name}</h3>
      <div className={numberDetails}>
        <div>
          <h4 className={detailnumTitle}>Post</h4>
          <h5 className={detailnumValue}>2</h5>
        </div>
        <div>
          <h4 className={detailnumTitle}>Followers</h4>
          <h5 className={detailnumValue}>0</h5>
        </div>
        {isLoggedInUser && (
          <div>
            <h4 className={detailnumTitle}>Following</h4>
            <h5 className={detailnumValue}>1</h5>
          </div>
        )}
      </div>
      {isLoggedInUser && (
        <>
          <div className={viewBox}>
            <h5 className={viewBoxTitle}>Your Profile viewed by</h5>
            <h6 className={viewBoxValue}>{userProfileViews}</h6>
          </div>
          <div className={viewBox}>
            <h5 className={viewBoxTitle}>Your Posts viewed by</h5>
            <h6 className={viewBoxValue}>1287</h6>
          </div>
        </>
      )}
    </div>
  );
};
// styling
const profileDetailCard = ctl(`
  w-full max-w-[272px] pt-6 pb-3 rounded-10px text-center bg-background-shade-3
`);
const profilePic = ctl(`
  w-[60px] h-[60px] mx-auto rounded-full 
`);
const profileName = ctl(`
  text-14px font-bold py-3 text-white
`);
const numberDetails = ctl(`
  bg-background-shade-2 p-3 flex items-center justify-center gap-8 mb-3
`);
const detailnumTitle = ctl(`
  text-12px font-medium text-gray-shade-7 mb-2
`);
const detailnumValue = ctl(`
  text-14px font-semibold text-white
`);
const viewBox = ctl(`
   flex items-center justify-between px-4 py-2
`);
const viewBoxTitle = ctl(`
  text-12px font-medium text-gray-shade-7
`);
const viewBoxValue = ctl(`
  text-12px font-semibold text-brand-primary
`);
