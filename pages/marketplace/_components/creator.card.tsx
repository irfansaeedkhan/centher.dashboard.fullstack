import { AppRoutes } from "@/constants/app.routes";
import useGetUser from "@/hooks/use.get.user";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CreatorCardProps {
  publicKey: string;
}

const CreatorCard = ({ publicKey }: CreatorCardProps) => {
  const { user } = useGetUser(publicKey);
  return (
    <div className="flex gap-3 items-center min-w-[172px]">
      {user ? (
        <Image
          src={user.profile_image.path}
          width={48}
          height={48}
          alt="profile"
          className="!w-12 !h-12 object-cover rounded-full"
        />
      ) : (
        <div className="rounded-full !w-12 !h-12 bg-gray-shade-3 animate-pulse"></div>
      )}
      {user ? (
        <div className={`flex flex-col gap-[2px] !flex-grow`}>
          <Link
            href={{
              pathname: AppRoutes.profile.nfts,
              query: {
                account_address: user?.account_address,
              },
            }}
            className="text-sm font-medium text-white hover:text-brand-primary text-ellipsis line-clamp-1 overflow-hidden"
          >
            {user?.display_name}
          </Link>
          {/* <p className="text-xs text-gray-shade-7">Tradesr</p> */}
        </div>
      ) : (
        <div className="h-[15px] w-[110px] bg-gray-shade-3 rounded-sm animate-pulse"></div>
      )}
    </div>
  );
};

export default CreatorCard;
