import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import useGetUser from "@/hooks/use.get.user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface CreatorCardProps {
  data: TopCreatorCardData;
  className?: string;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ data, className }) => {
  const { user } = useGetUser(data.account_address);
  const verificationTick = useVerificationTick({ user });

  return (
    <div className={clsx("flex min-w-max items-center gap-3", className)}>
      <Image
        src={data.profile_image.path}
        width={48}
        height={48}
        alt={data.display_name}
        className="!h-12 !w-12 flex-shrink-0 rounded-full object-cover"
      />
      <Link
        href={{
          pathname: AppRoutes.profile.nfts,
          query: {
            account_address: data.account_address,
          },
        }}
        className={clsx(
          `!flex items-center text-sm  font-medium text-white hover:text-brand-primary`,
          data.display_name.includes(" ")
            ? "text-ellipsis line-clamp-1"
            : "block w-full max-w-full overflow-hidden truncate"
        )}
        title={data.display_name}
      >
        {sliceDisplayName(data.display_name)}
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
      </Link>
    </div>
  );
};

export default CreatorCard;

export interface TopCreatorCardData {
  account_address: User["account_address"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
}
