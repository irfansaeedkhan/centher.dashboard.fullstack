import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { RecommendedPeople } from "@/lib/recommended-people";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import Button from "@/components/button";

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
    <div key={user._id} className={`my-4 flex items-center justify-between`}>
      <div className={`flex items-center justify-center gap-3`}>
        <Link
          href={{
            pathname: AppRoutes.profile.user_id,
            query: {
              user_id: user._id,
            },
          }}
          title={user.display_name}
          className="relative flex h-10 w-10"
        >
          <Image
            src={user.profile_image}
            width={40}
            height={40}
            alt="profile pic"
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
          {verificationTick && (
            <div className="absolute right-[-5px] top-[-1px] flex h-4 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-shade-3 ">
              <Image
                src={verificationTick}
                width={12}
                height={12}
                alt="member icon"
                className="h-3 w-3 flex-shrink-0 object-contain"
              />
            </div>
          )}
        </Link>

        <div>
          <div className="flex items-center">
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
                className={`text-14px word-break text-gradient-hover max-w-[70px] truncate font-semibold text-white`}
              >
                {sliceDisplayName(user.display_name)}
              </h5>
            </Link>
          </div>

          <h6 className={`text-12px font-ligth text-gray-shade-7`}>
            {sliceAccountAddress(user._id)}
          </h6>
        </div>
      </div>

      <Button
        title={user.is_followed_by_loggedin_user ? "Following" : "Follow"}
        onClick={() => followUser(user._id)}
        variant="primary"
        className="h-8 w-[66px] text-[10px]"
        borderRounded="10px"
      />
    </div>
  );
};

export default RecommendedUserCard;
