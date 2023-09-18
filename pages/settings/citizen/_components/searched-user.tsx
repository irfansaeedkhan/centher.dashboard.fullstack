import React from "react";
import Image from "next/image";
import { SearchResultWithType } from "@/lib/search";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

export const SearchedUser: React.FC<{
  user: SearchResultWithType;
  onClick: (user_id: string) => void;
}> = ({ user, onClick }) => {
  const verificationTick = useVerificationTick({
    user,
  });

  return (
    <div
      key={user._id}
      className="flex cursor-pointer items-center gap-x-3 border-b border-gray-shade-3 p-4 last:mb-0 last:border-none hover:bg-black-shade-2"
      onClick={() => {
        onClick(user._id);
      }}
    >
      <Image
        src={user.profile_image}
        alt={user.display_name}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full"
      />
      <div className="flex-grow">
        <p className="word-break text-sm font-medium text-white">
          {user.display_name}

          {verificationTick && (
            <Image
              src={verificationTick}
              alt={"Membership"}
              width={16}
              height={16}
              className="-mt-0.5 ml-0.5 inline-block"
            />
          )}
        </p>
        <p className="text-xs font-normal text-gray-shade-1">
          {sliceAccountAddress(user._id)}
        </p>
      </div>
    </div>
  );
};
