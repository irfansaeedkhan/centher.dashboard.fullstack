import React from "react";
import Image from "next/image";
import { SearchResultWithType } from "@/lib/search";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import Button from "@/components/button";

export const FindUsers: React.FC<{
  user: SearchResultWithType;
  onInviteClick: (user: SearchResultWithType) => void;
}> = ({ user, onInviteClick }) => {
  const verificationTick = useVerificationTick({
    user,
  });

  return (
    <div
      key={user._id}
      className="flex cursor-pointer items-center gap-x-3 rounded-xl bg-black-shade-1 p-4 hover:bg-black-shade-2"
    >
      <Image
        src={user.profile_image}
        alt={user.display_name}
        width={40}
        height={40}
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
      </div>
      <Button
        title={"Invite"}
        variant="primary"
        onClick={() => onInviteClick(user)}
        borderRounded="10px"
        backgroundColor="#0a0a0a"
        className={`text-xs font-medium`}
      />
    </div>
  );
};
