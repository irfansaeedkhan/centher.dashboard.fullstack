// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";

// app imports
import { useGetProfileCardDetails } from "./use.get.profile.card.details";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

interface ProfileDetailCardProps {
  user: User;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
}) => {
  const profileCardDetails = useGetProfileCardDetails(user);

  return (
    <div
      className={clsx(
        `w-11/12 sm:w-[272px] lg:sticky lg:top-0 pt-4 rounded-10px text-center bg-background-shade-3 overflow-hidden`,
        !!profileCardDetails.profile_views_count && `pb-4`
      )}
    >
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: user.account_address,
          },
        }}
      >
        <Image
          src={user.profile_image.path}
          className={profilePic}
          alt={user.display_name}
          width={60}
          height={60}
          sizes={"256px"}
        />
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
      <div
        className={`bg-background-shade-2 py-3 px-7 flex items-center justify-center gap-8`}
      >
        <div>
          <Link href={`/profile/${user.account_address}`}>
            <h4 className={detailnumTitle}>Posts</h4>
            <h5 className={detailNumValue}>
              {profileCardDetails.posts_count ?? "--"}
            </h5>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${user.account_address}/followers`}>
            <h4 className={detailnumTitle}>Followers</h4>
            <h5 className={detailNumValue}>
              {profileCardDetails.followers_count ?? "--"}
            </h5>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${user.account_address}/following`}>
            <h4 className={detailnumTitle}>Followings</h4>
            <h5 className={detailNumValue}>
              {profileCardDetails.following_count ?? "--"}
            </h5>
          </Link>
        </div>
      </div>
      {!!profileCardDetails.profile_views_count && (
        <div className={viewBox}>
          <h5 className={viewBoxTitle}>Your Profile viewed by</h5>
          <h6 className={viewBoxValue}>
            {profileCardDetails.profile_views_count}
          </h6>
        </div>
      )}
      {!!profileCardDetails.posts_views_count && (
        <div className={viewBox}>
          <h5 className={viewBoxTitle}>Your Posts viewed by</h5>
          <h6 className={viewBoxValue}>
            {" "}
            {profileCardDetails.posts_views_count ?? "--"}
          </h6>
        </div>
      )}
    </div>
  );
};

// styling

const profilePic = ctl(`
  w-[60px] h-[60px] mx-auto rounded-full cursor-pointer object-cover
`);
const profileName = ctl(`
  text-14px font-bold pt-3 pb-6 text-white cursor-pointer
`);
const detailnumTitle = ctl(`
  text-12px font-medium text-gray-shade-7 mb-2
`);
const detailNumValue = ctl(`
  text-14px font-semibold text-white
`);
const viewBox = `flex items-center justify-between px-4 py-2`;
const viewBoxTitle = ctl(`
  text-12px font-medium text-gray-shade-7
`);
const viewBoxValue = ctl(`
  text-12px font-semibold text-brand-primary
`);
