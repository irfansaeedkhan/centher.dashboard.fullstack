import { AppRoutes } from "@/constants/app.routes";
import useGetUser from "@/hooks/use.get.user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CreatorCardProps {
  publicKey: string;
}

const CreatorCard = ({ publicKey }: CreatorCardProps) => {
  const { user } = useGetUser(publicKey);
  return (
    <div className="flex min-w-[172px] items-center gap-3">
      {user ? (
        <Image
          src={user.profile_image.path}
          width={48}
          height={48}
          alt="profile"
          className="!h-12 !w-12 rounded-full object-cover"
        />
      ) : (
        <div className="!h-12 !w-12 animate-pulse rounded-full bg-gray-shade-3"></div>
      )}
      {user ? (
        <div className={`flex !flex-grow flex-col gap-[2px]`}>
          <Link
            href={{
              pathname: AppRoutes.profile.nfts,
              query: {
                account_address: user?.account_address,
              },
            }}
            className="overflow-hidden text-ellipsis text-sm font-medium text-white line-clamp-1 hover:text-brand-primary"
          >
            {sliceDisplayName(user && user?.display_name)}
          </Link>
          {/* <p className="text-xs text-gray-shade-7">Tradesr</p> */}
        </div>
      ) : (
        <div className="h-[15px] w-[110px] animate-pulse rounded-sm bg-gray-shade-3"></div>
      )}
    </div>
  );
};

export default CreatorCard;
