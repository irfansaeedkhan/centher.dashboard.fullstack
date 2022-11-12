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

interface SingleSearchUserProps {
  result: IUserWithFollow;
}

const UserWithFollow = React.forwardRef<HTMLDivElement, SingleSearchUserProps>(
  ({ result }, ref) => {
    const [_result, setResult] = useState<IUserWithFollow>(result);
    const { user: loggedInUser } = useUser();
    const [verifyIcon, setVerifyIcon] = useState<string>("");
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
      setTimeout(function () {
        setVerifyIcon("/images/v1.gif");
      }, 3000);
      setTimeout(function () {
        setVerifyIcon("/images/v2.gif");
      }, 4600);
      setInterval(() => {
        setVerifyIcon("/images/lastframe.png");
      }, 10000);
      setInterval(() => {
        setVerifyIcon("/images/v2.gif");
      }, 20000);
    }, []);
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
              <Circle className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-12 !w-12 object-cover " />
              <div className="verifiedIcon absolute bottom-[-12px] right-[-17px] !h-[34px] !w-[34px] !m-0">
                {verifyIcon.length > 1 && (
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
