import React from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { EyeOffFollow } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { RecommendedPeople } from "@/lib/recommended-people";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface RecommendedUserCardProps {
  user: RecommendedPeople;
  followUser: (userId: string) => void;
}

const RecommendedUserCard: React.FC<RecommendedUserCardProps> = ({
  user,
  followUser,
}) => {
  const verificationTick = useVerificationTick({ user });

  return (
    <div
      key={user._id}
      className="mt-3 flex h-[84px] w-full items-center justify-between gap-5 rounded-2xl bg-[#1B1C22] px-4"
    >
      <div className={`flex items-center justify-center gap-3`}>
        <Link
          href={{
            pathname: AppRoutes.profile.user_id,
            query: {
              user_id: user._id,
            },
          }}
          title={user.display_name}
          className="flex"
        >
          <Image
            src={user.profile_image}
            width={44}
            height={44}
            alt="profile pic"
            className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
          />
        </Link>

        <div>
          <div className="flex items-center ">
            <Link
              href={{
                pathname: AppRoutes.profile.user_id,
                query: {
                  user_id: user._id,
                },
              }}
              title={user.display_name}
            >
              <h5
                className={`word-break text-gradient-hover max-w-[100px] truncate text-sm font-semibold text-white fsm:max-w-[200px] `}
              >
                {sliceDisplayName(user.display_name)}
              </h5>
            </Link>
            {verificationTick && (
              <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                <Image
                  src={verificationTick}
                  alt={
                    user.membership.status === "citizen"
                      ? "Citizen"
                      : "Verified"
                  }
                  width={16}
                  height={16}
                />
              </span>
            )}
          </div>

          <h6 className={`font-ligth text-xs text-gray-shade-7`}>
            {sliceAccountAddress(user._id)}
          </h6>
        </div>
      </div>
      <div
        title={user.is_followed_by_loggedin_user ? "Unfollow" : "Follow"}
        className={clsx(
          "flex h-10 w-[54px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[14px] border",
          user.is_followed_by_loggedin_user
            ? " border-gray-shade-3"
            : " gradient-border-3 p-[1px]"
        )}
        onClick={() => followUser(user._id)}
      >
        {user.is_followed_by_loggedin_user ? (
          <EyeOffFollow />
        ) : (
          <Image
            src={"/images/gradient-eye.svg"}
            alt={"Follow"}
            width={24}
            height={24}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendedUserCard;
