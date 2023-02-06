import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { MutualFollowersData } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

interface Props {
  mutualFollowersData: MutualFollowersData | null;
}

const FollowedComponent: React.FC<Props> = ({ mutualFollowersData }) => {
  return (
    <div className="flex w-full items-center gap-2 mt-3 justify-center">
      <div
        className={clsx(
          `flex relative w-full h-6`,
          mutualFollowersData?.users.length === 1 && `max-w-[24px]`,
          mutualFollowersData?.users.length === 2 && `max-w-[36px]`,
          mutualFollowersData?.users.length === 3 && `max-w-[50px]`
        )}
      >
        {mutualFollowersData?.users.map((user, index) => {
          return (
            <Image
              key={user._id}
              src={user.profile_image.path}
              alt="profile image"
              width={24}
              height={24}
              className={clsx(
                `!w-6 !h-6 rounded-full border-[1.5px] border-elevation-1 absolute`,
                index === 1 && `left-[0.7rem] z-10`,
                index === 2 && `left-[1.5rem] z-20`
              )}
            />
          );
        })}
      </div>
      {mutualFollowersData &&
        (mutualFollowersData.users.length > 0 ||
          mutualFollowersData.other_users_count > 0) && (
          <div className="text-xs font-medium text-gray-shade-7">
            <span>followed by </span>
            {mutualFollowersData.users.map((user, index) => (
              <Link
                href={{
                  pathname: AppRoutes.profile.account_address,
                  query: {
                    account_address: user.account_address,
                  },
                }}
                key={user._id}
                className="hover:text-brand-primary"
              >
                {sliceDisplayName(user && user.display_name)}
                {index !== mutualFollowersData.users.length - 1 && ", "}
              </Link>
            ))}
            {mutualFollowersData &&
              mutualFollowersData.other_users_count !== 0 && (
                <span>
                  , and {mutualFollowersData.other_users_count} others
                </span>
              )}
          </div>
        )}
    </div>
  );
};

export default FollowedComponent;
