import { SearchIcon } from "@/assets/svgs";
import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  const verificationTick = useVerificationTick(user);

  return (
    <div className="p-5 flex gap-2 items-center">
      <SearchIcon />
      <Link
        className="flex items-center"
        onClick={() => {
          setSearchQueryInput("");
          setOpenPopup(false);
        }}
        href={`/profile/${user.account_address}`}
      >
        <span className="text-white text-sm font-medium hover:text-brand-primary">
          {sliceDisplayName(user && user.display_name)}
        </span>
        {!!verificationTick && (
          <span className="verifiedIcon w-5 h-5 ml-0.5 fsm:ml-1">
            <Image
              src={verificationTick}
              alt={"Verified"}
              width={20}
              height={20}
            />
          </span>
        )}
      </Link>
    </div>
  );
};

export default SearchPopupResult;
