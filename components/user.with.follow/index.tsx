import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";
import useUser from "@/hooks/use.user";
import FinalButton from "@/components/button/final.button";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { axiosApiCenther } from "@/utils/axios";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import type { IUserWithFollow } from "./types";

interface SingleSearchUserProps {
  result: IUserWithFollow;
}

const UserWithFollow = React.forwardRef<HTMLDivElement, SingleSearchUserProps>(
  ({ result }, ref) => {
    const [_result, setResult] = useState<IUserWithFollow>(result);
    const { user: loggedInUser } = useUser();
    const verificationTick = useVerificationTick({ user: _result });

    const followUser = async (following_id: string) => {
      try {
        setResult((prev) => ({
          ...prev,
          is_followed_by_loggedin_user: !prev.is_followed_by_loggedin_user,
        }));

        await axiosApiCenther.post("api/socials/followers", {
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
        className="flex items-center justify-between gap-4  border-b border-gray-shade-3 bg-background-shade-3 p-4 first:rounded-t-lg last:rounded-b-lg last:border-0 fsm:gap-10"
      >
        <div className="word-break flex items-center gap-2 truncate">
          <Link
            href={{
              pathname: AppRoutes.profile.user_id,
              query: {
                user_id: _result._id,
              },
            }}
          >
            <div className="relative h-10 w-10 sm:!h-12 sm:!w-12">
              <Image
                src={_result.profile_image}
                alt=""
                width={40}
                height={40}
                className="absolute left-[50%] top-[50%] !m-0 h-10 w-10 translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-background-shade-3 object-cover sm:!h-12 sm:!w-12"
                sizes={"256px"}
              />
            </div>
          </Link>
          <div className="word-break flex flex-col gap-1 truncate">
            <Link
              href={{
                pathname: AppRoutes.profile.user_id,
                query: {
                  user_id: _result._id,
                },
              }}
              title={_result.display_name}
              className={`flex items-center justify-start`}
            >
              <span
                title={_result.display_name}
                className={clsx(
                  `inline-block items-center text-sm font-medium text-white hover:text-brand-primary fsm:text-base fsm:font-semibold`,
                  `block w-full overflow-hidden truncate break-words`
                )}
              >
                {_result && sliceDisplayName(_result.display_name)}
              </span>
              {!!verificationTick && (
                <span className="verifiedIcon ml-0.5 inline-block h-5 w-5 min-w-[1.25rem] fsm:ml-1">
                  <Image
                    src={verificationTick}
                    alt={"Verified"}
                    width={20}
                    height={20}
                  />
                </span>
              )}
            </Link>
            <div className="text-xs text-gray-shade-2 fsm:text-sm">
              {sliceAccountAddress(_result._id)}
            </div>
          </div>
        </div>
        {loggedInUser?._id !== _result._id && (
          <FinalButton
            title={
              _result.is_followed_by_loggedin_user ? "Following" : "Follow"
            }
            className="text-sm"
            onClick={() => followUser(_result._id)}
          />
        )}
      </div>
    );
  }
);

UserWithFollow.displayName = "UserWithFollow";

export default UserWithFollow;
