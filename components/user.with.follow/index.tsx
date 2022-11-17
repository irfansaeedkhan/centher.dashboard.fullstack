import React, { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { sliceAccountAddress } from "@/utils/user.helpers";

import type { IUserWithFollow } from "./types";
import { Circle } from "@/assets/svgs";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface SingleSearchUserProps {
  result: IUserWithFollow;
}

const UserWithFollow = React.forwardRef<HTMLDivElement, SingleSearchUserProps>(
  ({ result }, ref) => {
    const [_result, setResult] = useState<IUserWithFollow>(result);
    const { user: loggedInUser } = useUser();
    const [verifyIcon, setVerifyIcon] = useState<string>("");
    const [strokeColor, setStrokeColor] = useState<string>("#B1B1B1");
    /* 
  Stroke colors :   #1B1C22 (rainbow)  #B1B1B1 (silver)  #E2BD3A (gold)
verification icon variants
Rainbow1  Rainbow2 RainbowLastFrame
gold1 gold2 goldLastFrame
silver1 silver2 silverLastFrame
*/

    const iconVerifyProps = useVerificationTick(_result?.account_address);
    const followUser = async (following_id: string) => {
      try {
        setResult((prev) => ({
          ...prev,
          is_followed_by_loggedin_user: !prev.is_followed_by_loggedin_user,
        }));

        await axiosNodeApi.post("api/socials/follows", {
          following_id,
        });
      } catch (error: any) {
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };

    useLayoutEffect(() => {
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
    }, [iconVerifyProps, _result?.account_address]);

    return (
      <div
        ref={ref}
        className="p-4 bg-background-shade-3 rounded-lg flex gap-10 items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <Link href={`/profile/${_result.account_address}`}>
            <div className="relative h-12 !w-12">
              <Image
                src={_result.profile_image.path}
                alt=""
                width={40}
                height={40}
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full !h-12 !w-12 object-cover border-2 border-background-shade-3 !m-0"
                sizes={"256px"}
              />
              {iconVerifyProps !== "no-icon" && (
                <Circle
                  className={clsx(
                    `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-12 !w-12 object-cover`,
                    iconVerifyProps === "rainbow" &&
                      "[&>*>*>*]: AnimatecircleRainbow",
                    iconVerifyProps === "silver" &&
                      "[&>*>*>*]: AnimatecircleSilver",
                    iconVerifyProps === "gold" && "[&>*>*>*]: AnimatecircleGold"
                  )}
                />
              )}
              <div className="verifiedIcon absolute bottom-[-12px] right-[-17px] !h-[34px] !w-[34px] !m-0">
                {iconVerifyProps !== "no-icon" && verifyIcon && (
                  <Image
                    src={verifyIcon}
                    alt={"verified icon"}
                    width={24}
                    height={24}
                    className=""
                  />
                )}
              </div>
            </div>
          </Link>
          <div className="flex flex-col gap-1">
            <Link
              href={`/profile/${_result.account_address}`}
              className="text-base font-semibold text-white hover:text-brand-primary"
            >
              {_result.display_name}
            </Link>
            <div className="text-sm text-gray-shade-2">
              {sliceAccountAddress(_result.account_address)}
            </div>
          </div>
        </div>
        {loggedInUser?._id !== _result._id && (
          <button
            className={clsx(
              _result.is_followed_by_loggedin_user
                ? followingButton
                : connectButton
            )}
            onClick={() => followUser(_result._id)}
          >
            <span
              className={clsx(
                _result.is_followed_by_loggedin_user &&
                  "animationTextHeading !text-sm"
              )}
            >
              {_result.is_followed_by_loggedin_user ? "Following" : "Follow"}
            </span>
          </button>
        )}
      </div>
    );
  }
);

UserWithFollow.displayName = "UserWithFollow";

export default UserWithFollow;

const connectButton = ctl(`
  px-6 
  py-2
  flex
  text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-brand-primary-dark 
`);
const followingButton = ctl(`
  px-6 
  py-2
  flex
  !text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-gray-shade-3 
  
`);
