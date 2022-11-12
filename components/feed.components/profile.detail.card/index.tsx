import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import { Circle } from "@/assets/svgs";

import { useGetProfileCardDetails } from "./use.get.profile.card.details";

interface ProfileDetailCardProps {
  user: User;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
}) => {
  const profileCardDetails = useGetProfileCardDetails(user);
  const [verifyIcon, setVerifyIcon] = useState<string>("");

  useEffect(() => {
    const timeout1 = setTimeout(function () {
      setVerifyIcon("/images/v1.gif");
    }, 3000);
    const timeout2 = setTimeout(function () {
      setVerifyIcon("/images/v2.gif");
    }, 4600);
    const interval1 = setInterval(() => {
      setVerifyIcon("/images/lastframe.png");
    }, 10000);
    const interval2 = setInterval(() => {
      setVerifyIcon("/images/v2.gif");
    }, 20000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <div
      className={clsx(
        `w-11/12 sm:w-[272px] pt-12 rounded-10px overflow-hidden text-center bg-background-shade-3 relative`,
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
        <div
          className={`absolute top-0 left-0 bg-center bg-cover bg-no-repeat w-full h-[84px] bg-[url('/images/coverImage.png')]`}
          style={{
            backgroundImage: `url(/images/profile-header-cover.jpg)`,
          }}
        ></div>
        <div className={`relative mx-auto h-[60px] !w-[60px]`}>
          <Image
            src={user.profile_image.path}
            className={`w-[60px] h-[60px] mx-auto rounded-full cursor-pointer object-cover`}
            alt={user.display_name}
            width={60}
            height={60}
            sizes={"256px"}
          />
          <Circle
            className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[60px] !w-[60px] object-cover`}
          />
          <div
            className={`verifiedIcon absolute bottom-[-14px] right-[-14px] !h-[34px] !w-[34px] !m-0`}
          >
            {verifyIcon.length > 1 && (
              <Image
                src={verifyIcon}
                alt={"verified icon"}
                width={24}
                height={24}
              />
            )}
          </div>
        </div>
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: user.account_address,
          },
        }}
      >
        <h3
          className={`text-14px font-bold pt-3 pb-6 text-white cursor-pointer`}
        >
          {user.display_name}
        </h3>
      </Link>
      <div
        className={`bg-background-shade-2 py-3 px-7 flex items-center justify-center gap-8`}
      >
        <div>
          <Link href={`/profile/${user.account_address}`}>
            <h4 className={clsx(label, `mb-2`)}>Posts</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.posts_count ?? "--"}
            </h5>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${user.account_address}/followers`}>
            <h4 className={clsx(label, `mb-2`)}>Followers</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.followers_count ?? "--"}
            </h5>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${user.account_address}/following`}>
            <h4 className={clsx(label, `mb-2`)}>Followings</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.following_count ?? "--"}
            </h5>
          </Link>
        </div>
      </div>
      {!!profileCardDetails.profile_views_count && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Profile viewed by</h5>
          <h6 className={clsx(countBrand)}>
            {profileCardDetails.profile_views_count}
          </h6>
        </div>
      )}
      {!!profileCardDetails.posts_views_count && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Posts viewed by</h5>
          <h6 className={clsx(countBrand)}>
            {" "}
            {profileCardDetails.posts_views_count ?? "--"}
          </h6>
        </div>
      )}
    </div>
  );
};

const label = `text-12px font-medium text-gray-shade-7`;
const count = `text-14px font-semibold text-white`;
const countBrand = `text-12px font-semibold text-brand-primary`;
