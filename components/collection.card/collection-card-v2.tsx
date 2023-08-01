import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import clsx from "clsx";
import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

export interface CollectionCardProps {
  data: CollectionCardData;
  className?: string;
}

export const CollectionCardV2: React.FC<CollectionCardProps> = ({
  data,
  className,
}) => {
  const router = useRouter();
  const [coverImageUrl, setCoverImageUrl] = useState(data.coverImage);
  const [profileImageUrl, setProfileImageUrl] = useState(data.profileImage);
  const verificationTick = useVerificationTick({
    user: {
      membership: data.creator.membership,
    },
  });

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
          src={coverImageUrl}
          alt={data.name}
          width={340}
          height={180}
          className={`h-[180px] w-full rounded-t-lg object-cover`}
          onError={() => setCoverImageUrl("/images/placeholder-square.svg")}
        />
        <Image
          src={profileImageUrl}
          alt={data.name}
          width={64}
          height={64}
          className={`absolute top-full z-0 !h-16 !w-16 -translate-y-1/2 transform rounded-full border-2 border-gray-shade-3 object-cover`}
          onError={() => setProfileImageUrl("/images/placeholder-square.svg")}
        />
      </div>

      <div
        className={`mt-10 flex flex-grow flex-col items-center px-2 pb-8 fsm:px-4`}
      >
        <div className={`break-all text-[15px] font-medium text-white`}>
          {data.name}
        </div>
        {data.creator.is_registered ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push({
                pathname: AppRoutes.profile.user_id,
                query: {
                  user_id: data.creator._id,
                },
              });
            }}
            className={clsx(
              `mt-2 flex items-center text-center text-xs font-medium text-white`
            )}
            title={data.creator.display_name}
          >
            <span className="block max-w-[238px] truncate break-words">
              {sliceDisplayName(data.creator.display_name)}
            </span>
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
          </span>
        ) : (
          <span
            className={clsx(
              `mt-2 flex items-center text-center text-xs font-medium text-white`
            )}
            title={data.creator.display_name}
          >
            <span className="block max-w-[238px] truncate break-words">
              {sliceDisplayName(data.creator.display_name)}
            </span>
            {data.creator.membership.status === "verified" && (
              <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                <Image
                  src={"/images/rainbow-last-frame.png"}
                  alt={"Verified"}
                  width={20}
                  height={20}
                />
              </span>
            )}
          </span>
        )}
        <p
          className={`mt-4 line-clamp-1 flex-grow whitespace-pre-wrap break-all text-center text-xs font-medium text-gray-shade-14`}
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
    _id: User["_id"];
    display_name: User["display_name"];
    membership: User["membership"];
    is_registered: boolean;
  };
}
