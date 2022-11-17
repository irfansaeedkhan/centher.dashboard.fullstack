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
    <div className="flex gap-3 items-center min-w-[122px]">
      <Image
        src={user ? user.profile_image.path : `/images/a1.png`}
        width={48}
        height={48}
        alt="profile"
        className="!w-12 !h-12 object-cover rounded-full"
      />
      <div className={`flex flex-col gap-[2px]`}>
        <Link
          href={{
            pathname: AppRoutes.profile.nfts,
            query: {
              account_address: user?.account_address,
            },
          }}
          className="text-sm font-medium text-white hover:text-brand-primary-dark whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {user?.display_name}
        </Link>
        {/* <p className="text-xs text-gray-shade-7">Tradesr</p> */}
      </div>
    </div>
  );
};

export default CreatorCard;
