import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { TopCreator } from "@/models/top-creator";

interface CreatorCardProps {
  data: TopCreator;
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
      <Link
        href={{
          pathname: AppRoutes.profile.nfts,
          query: {
            user_id: data._id,
          },
        }}
        className={clsx(
          `text-gradient-hover !flex items-center  text-sm font-medium text-white`,
          data.display_name.includes(" ")
            ? "line-clamp-1 text-ellipsis"
            : "block w-full max-w-full overflow-hidden truncate"
        )}
        title={data.display_name}
      >
        {sliceDisplayName(data.display_name)}
        {verificationTick && (
          <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
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
    </div>
  );
};

export default CreatorCard;
