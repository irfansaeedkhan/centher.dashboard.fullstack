import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  user: User;
  setSearchQueryInput: (value: string) => void;
  setOpenPopup: (value: boolean) => void;
}

const SearchPopupResult: React.FC<Props> = ({
  user,
  setSearchQueryInput,
  setOpenPopup,
}) => {
  const verificationTick = useVerificationTick({ user });

  return (
    <div className="flex items-start gap-2 p-5">
      {/* <SearchIcon /> */}
      <Link
        className="word-break flex items-center truncate text-sm font-medium text-white hover:text-brand-primary"
        onClick={() => {
          setSearchQueryInput("");
          setOpenPopup(false);
        }}
        href={{
          pathname: AppRoutes.profile.user_id,
          query: {
            user_id: user._id,
          },
        }}
      >
        <span
          title={user.display_name}
          className={clsx(`block w-full overflow-hidden truncate`)}
        >
          {user && sliceDisplayName(user.display_name)}
        </span>
        {verificationTick && (
          <span className="verifiedIcon ml-0.5 inline-flex h-[22px] w-[22px] min-w-[22px] fsm:ml-1">
            <Image
              src={verificationTick}
              alt={
                user.membership.status === "citizen" ? "Citizen" : "Verified"
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

export default SearchPopupResult;
