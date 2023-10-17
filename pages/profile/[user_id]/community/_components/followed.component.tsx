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
    <div className="mt-3 flex w-full items-start justify-center gap-2">
      <div
        className={clsx(
          `relative flex h-6 w-full`,
          mutualFollowersData?.users.length === 1 && `max-w-[24px]`,
          mutualFollowersData?.users.length === 2 && `max-w-[36px]`,
          mutualFollowersData?.users.length === 3 && `max-w-[50px]`
        )}
      >
        {mutualFollowersData?.users.map((user, index) => {
          return (
            <Image
              key={user._id}
              src={user.profile_image}
              alt="profile image"
              width={24}
              height={24}
              className={clsx(
                `absolute !h-6 !w-6 rounded-full border-[1.5px] border-elevation-1`,
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
          <div className="word-break max-w-xl items-center gap-1 text-xs font-medium text-gray-shade-7">
            <span className="min-w-max">followed by </span>
            {mutualFollowersData.users.map((user, index) => (
              <Link
                href={{
                  pathname: AppRoutes.profile.user_id,
                  query: {
                    user_id: user._id,
                  },
                }}
                key={user._id}
                className={clsx(
                  `text-gradient-hover fmd:leading-[24px]`,
                  !user.display_name.includes(" ") &&
                    user.display_name.length > 20
                    ? "word-break inline  "
                    : "word-break inline  "
                )}
                title={user.display_name}
              >
                {sliceDisplayName(user.display_name)}
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
