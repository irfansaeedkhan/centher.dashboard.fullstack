import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import clsx from "clsx";

import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";

export interface CollectionCardProps {
  data: CollectionCardData;
  className?: string;
}

export const CollectionCardV2: React.FC<CollectionCardProps> = ({
  data,
  className,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push({
          pathname: AppRoutes.marketplace.collection,
          query: {
            collection: data.address,
          },
        });
      }}
      className={clsx(
        `flex w-full max-w-[300px] cursor-pointer flex-col rounded-lg border border-gray-shade-3`,
        className
      )}
    >
      <div className={`relative flex justify-center`}>
        <Image
          src={data.coverImage}
          alt={data.name}
          width={340}
          height={180}
          className={`h-[180px] w-full rounded-t-lg object-cover`}
        />
        <Image
          src={data.profileImage}
          alt={data.name}
          width={64}
          height={64}
          className={`absolute top-full z-0 !h-16 !w-16 -translate-y-1/2 transform rounded-full border-2 border-gray-shade-3 object-cover`}
        />
      </div>

      <div
        className={`mt-10 flex flex-grow flex-col items-center px-2 pb-8 fsm:px-4`}
      >
        <div className={`text-[15px] font-medium text-white`}>{data.name}</div>
        {data.creator.is_registered ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push({
                pathname: AppRoutes.profile.account_address,
                query: {
                  account_address: data.creator.account_address,
                },
              });
            }}
            className={`mt-2 text-ellipsis text-xs font-medium text-white line-clamp-1`}
          >
            {sliceDisplayName(data.creator.display_name)}
          </span>
        ) : (
          <span
            className={`mt-2 text-ellipsis text-xs font-medium text-white line-clamp-1`}
          >
            {sliceDisplayName(data.creator.display_name)}
          </span>
        )}
        <p
          className={`mt-4 flex-grow whitespace-pre-wrap text-center text-xs font-medium text-gray-shade-14 line-clamp-1`}
        >
          {data.description}
        </p>
      </div>
    </div>
  );
};

export interface CollectionCardData {
  address: string;
  name: string;
  profileImage: string;
  coverImage: string;
  description: string;
  creator: {
    account_address: User["account_address"];
    display_name: User["display_name"];
    is_registered: boolean;
  };
}
