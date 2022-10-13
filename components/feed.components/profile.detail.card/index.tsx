// React, Next, NPM Packages
import React from "react";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";
import Link from "next/link";

// app imports
import { useGetProfileCardDetails } from "./use.get.profile.card.details";
import { User } from "@/models/user";
import { getProfileImage } from "@/utils/helpers/get.profile.image";
import { AppRoutes } from "@/constants/app.routes";

interface ProfileDetailCardProps {
  user: User;
  isLoggedInUser: boolean;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
  isLoggedInUser,
}) => {
  const profileCardDetails = useGetProfileCardDetails(user);

  return (
    <div className={profileDetailCardContainer}>
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: user.account_address,
          },
        }}
      >
        <a>
          <Image
            src={getProfileImage(user)}
            className={profilePic}
            alt={user.display_name}
            width={60}
            height={60}
          />
        </a>
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: user.account_address,
          },
        }}
      >
        <h3 className={profileName}>{user.display_name}</h3>
      </Link>
      <div className={numberDetails}>
        <div>
          <h4 className={detailnumTitle}>Post</h4>
          <h5 className={detailNumValue}>
            {profileCardDetails.posts_count ?? "--"}
          </h5>
        </div>
        <div>
          <h4 className={detailnumTitle}>Followers</h4>
          <h5 className={detailNumValue}>
            {profileCardDetails.followers_count ?? "--"}
          </h5>
        </div>
        {isLoggedInUser && (
          <div>
            <h4 className={detailnumTitle}>Following</h4>
            <h5 className={detailNumValue}>
              {profileCardDetails.following_count ?? "--"}
            </h5>
          </div>
        )}
      </div>
      {isLoggedInUser && (
        <>
          <div className={viewBox}>
            <h5 className={viewBoxTitle}>Your Profile viewed by</h5>
            <h6 className={viewBoxValue}>
              {profileCardDetails.profile_views_count ?? "--"}
            </h6>
          </div>
          <div className={viewBox}>
            <h5 className={viewBoxTitle}>Your Posts viewed by</h5>
            <h6 className={viewBoxValue}>
              {" "}
              {profileCardDetails.posts_views_count ?? "--"}
            </h6>
          </div>
        </>
      )}
    </div>
  );
};

// styling
const profileDetailCardContainer = ctl(`
  w-full max-w-[272px] pt-6  rounded-10px text-center bg-background-shade-3 overflow-hidden
`);
const profilePic = ctl(`
  w-[60px] h-[60px] mx-auto rounded-full cursor-pointer dpImagePreview
`);
const profileName = ctl(`
  text-14px font-bold pt-3 pb-6 text-white cursor-pointer
`);
const numberDetails = ctl(`
  bg-background-shade-2 p-3 flex items-center justify-center gap-8 
`);
const detailnumTitle = ctl(`
  text-12px font-medium text-gray-shade-7 mb-2
`);
const detailNumValue = ctl(`
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
