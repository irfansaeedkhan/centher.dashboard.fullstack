import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { User } from "@/models/user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import {
  DefaultCircle,
  GoldCircle,
  RainbowCircle,
  SilverCircle,
} from "@/assets/svgs";

import { useGetProfileCardDetails } from "./use.get.profile.card.details";

interface ProfileDetailCardProps {
  user: User;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
}) => {
  const profileCardDetails = useGetProfileCardDetails(user);
  const [verifyIcon, setVerifyIcon] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>("none");
  /* 
  Stroke colors :   #1B1C22 (rainbow)  #B1B1B1 (silver)  #E2BD3A (gold)
  verification icon variants
  Rainbow1  Rainbow2 RainbowLastFrame
  gold1 gold2 goldLastFrame
  silver1 silver2 silverLastFrame
  */
  const iconVerifyProps = useVerificationTick(user?.account_address);

  useEffect(() => {
    if (iconVerifyProps === "rainbow") {
      setStrokeColor("#1B1C22");
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/Rainbow1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/Rainbow2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/RainbowLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/Rainbow2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps === "silver") {
      setStrokeColor("#B1B1B1");

      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/silver1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/silver2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/silverLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/silver2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps == "gold") {
      setStrokeColor("#E2BD3A");

      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/gold1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/gold2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/goldLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/gold2.gif");
      }, 20000);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps === "no-icon") {
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/silver1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/silver2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/silverLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/silver2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    }
  }, [iconVerifyProps, user?.account_address]);

  return (
    <div
      className={clsx(
        `w-11/12 fsm:w-[272px] pt-12 rounded-10px overflow-hidden text-center bg-background-shade-3 relative`,
        !!profileCardDetails.posts_views_count && `pb-4`
      )}
    >
      <div
        className={`absolute top-0 left-0 bg-center bg-cover bg-no-repeat w-full h-[84px] bg-[url('/images/profile-header-cover.jpg')]`}
      ></div>

      <div className={`relative mx-auto h-[60px] !w-[60px]`}>
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
            className={`w-[60px] h-[60px] mx-auto rounded-full cursor-pointer object-cover`}
            alt={user.display_name}
            width={60}
            height={60}
            sizes={"256px"}
          />
          {iconVerifyProps !== "no-icon" && (
            <>
              {iconVerifyProps === "rainbow" && (
                <RainbowCircle
                  className={clsx(
                    `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[60px] !w-[60px] object-cover`
                  )}
                />
              )}
              {iconVerifyProps === "silver" && (
                <SilverCircle
                  className={clsx(
                    `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[60px] !w-[60px] object-cover`
                  )}
                />
              )}
              {iconVerifyProps === "gold" && (
                <GoldCircle
                  className={clsx(
                    `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[60px] !w-[60px] object-cover`
                  )}
                />
              )}
              <DefaultCircle
                className={clsx(
                  `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[60px] !w-[60px] object-cover`
                )}
              />
            </>
          )}
          <div
            className={`verifiedIcon absolute bottom-[-14px] right-[-14px] !h-[34px] !w-[34px] !m-0`}
          >
            {iconVerifyProps !== "no-icon" && verifyIcon && (
              <Image
                src={verifyIcon}
                alt={"verified icon"}
                width={24}
                height={24}
              />
            )}
          </div>
        </Link>
      </div>

      <h3 className={`px-1 py-3`}>
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: user.account_address,
            },
          }}
          className={`line-clamp-1 text-ellipsis text-white text-sm font-bold`}
        >
          {user.display_name}
        </Link>
      </h3>

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

      {(profileCardDetails.profile_views_count === 0 ||
        profileCardDetails.profile_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Profile Viewed By</h5>
          <h6 className={clsx(countBrand)}>
            {profileCardDetails.profile_views_count}
          </h6>
        </div>
      )}

      {(profileCardDetails.posts_views_count === 0 ||
        profileCardDetails.posts_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Posts Views</h5>
          <h6 className={clsx(countBrand)}>
            {" "}
            {profileCardDetails.posts_views_count}
          </h6>
        </div>
      )}
    </div>
  );
};

const label = `text-12px font-medium text-gray-shade-7`;
const count = `text-14px font-semibold text-white`;
const countBrand = `text-12px font-semibold text-brand-primary`;
