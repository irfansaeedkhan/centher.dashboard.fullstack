import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { formatAddress } from "@/utils/format.address";

interface CreatorCardProps {
  data: TopCreatorCardData;
  className?: string;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ data, className }) => {
  const verificationTick = useVerificationTick({ user: data });

  return (
    <div className={clsx("flex min-w-max items-center gap-3", className)}>
      <Image
        src={data.profile_image}
        width={48}
        height={48}
        alt={data.display_name}
        className="!h-12 !w-12 flex-shrink-0 rounded-full object-cover"
      />
      {data.is_registered ? (
        <Link
          href={{
            pathname: AppRoutes.profile.nfts,
            query: {
              user_id: data._id,
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
          {verificationTick && (
            <span className="verifiedIcon ml-0.5 inline-flex h-[22px] w-[22px] min-w-[22px] fsm:ml-1">
              <Image
                src={verificationTick}
                alt={
                  data.membership.status === "citizen" ? "Citizen" : "Verified"
                }
                width={16}
                height={16}
              />
            </span>
          )}
        </Link>
      ) : (
        <span
          className={clsx(
            `!flex items-center text-sm  font-medium text-white hover:text-brand-primary`,
            data.display_name.includes(" ")
              ? "text-ellipsis line-clamp-1"
              : "block w-full max-w-full overflow-hidden truncate"
          )}
          title={data.display_name}
        >
          {formatAddress(data.display_name)}
        </span>
      )}
    </div>
  );
};

export default CreatorCard;

export interface TopCreatorCardData {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  is_registered: boolean;
}
