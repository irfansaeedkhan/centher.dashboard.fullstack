import React from "react";
import Image from "next/image";

import Button from "@/components/button";
import { SearchResultWithType } from "@/lib/search";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

export const RemoveUser: React.FC<{
  user: SearchResultWithType;
  onRemoveClick: (user: SearchResultWithType) => void;
}> = ({ user, onRemoveClick }) => {
  const verificationTick = useVerificationTick({
    user,
  });

  return (
    <div
      key={user._id}
      className="flex cursor-pointer items-center gap-x-3 p-4"
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
              alt={"Users"}
              width={16}
              height={16}
              className="-mt-0.5 ml-0.5 inline-block"
            />
          )}
        </p>
      </div>
      <Button
        onClick={() => onRemoveClick(user)}
        title="Remove"
        variant="danger"
        className="text-xs font-medium"
      />
    </div>
  );
};
