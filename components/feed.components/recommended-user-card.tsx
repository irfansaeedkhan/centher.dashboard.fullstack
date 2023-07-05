import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { RecommendedPeople } from "@/lib/recommended-people";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import FinalButton from "@/components/button/final.button";

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
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: user.account_address,
            },
          }}
          title={user.display_name}
        >
          <Image
            src={user.profile_image.path}
            width={44}
            height={44}
            alt="profile pic"
          />
        </Link>

        <div>
          <div className="flex items-center">
            <Link
              href={{
                pathname: AppRoutes.profile.account_address,
                query: {
                  account_address: user.account_address,
                },
              }}
              title={user.display_name}
            >
              <h5
                className={`text-14px word-break max-w-[70px] truncate font-semibold text-white hover:text-brand-primary`}
              >
                {sliceDisplayName(user.display_name)}
              </h5>
            </Link>

            {!!verificationTick && (
              <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                <Image
                  src={verificationTick}
                  alt={"Verified"}
                  width={20}
                  height={20}
                />
              </span>
            )}
          </div>

          <h6 className={`text-12px font-ligth text-gray-shade-7`}>
            {sliceAccountAddress(user.account_address)}
          </h6>
        </div>
      </div>

      <FinalButton
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
