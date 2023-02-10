import React, { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

import useUser from "@/hooks/use.user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { axiosNodeApi } from "@/utils/axios";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

import type { IUserWithFollow } from "./types";

interface SingleSearchUserProps {
  result: IUserWithFollow;
}

const UserWithFollow = React.forwardRef<HTMLDivElement, SingleSearchUserProps>(
  ({ result }, ref) => {
    const [_result, setResult] = useState<IUserWithFollow>(result);
    const { user: loggedInUser } = useUser();
    const verificationTick = useVerificationTick(_result);

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

    return (
      <div
        ref={ref}
        className="p-4 bg-background-shade-3 rounded-lg flex gap-10 items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <Link href={`/profile/${_result.account_address}`}>
            <div className="relative sm:!h-12 sm:!w-12 h-10 w-10">
              <Image
                src={_result.profile_image.path}
                alt=""
                width={40}
                height={40}
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full sm:!h-12 sm:!w-12 h-10 w-10 object-cover border-2 border-background-shade-3 !m-0"
                sizes={"256px"}
              />
            </div>
          </Link>
          <div className="flex flex-col gap-1">
            <Link
              href={`/profile/${_result.account_address}`}
              title={_result.display_name}
              className="flex items-center"
            >
              <span className="fsm:text-base text-sm fsm:font-semibold font-medium text-white hover:text-brand-primary text-ellipsis line-clamp-1">
                {sliceDisplayName(_result && _result.display_name)}
              </span>
              {!!verificationTick && (
                <span className="verifiedIcon !h-6 !w-6 ml-0.5 fsm:ml-1">
                  <Image
                    src={verificationTick}
                    alt={"Verified"}
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                </span>
              )}
            </Link>
            <div className="fsm:text-sm text-xs text-gray-shade-2">
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

const connectButton = `fsm:px-6 px-4 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark`;

const followingButton = `fsm:px-6 px-4 py-2 flex !text-sm rounded-lg items-center font-semibold bg-gray-shade-3`;
