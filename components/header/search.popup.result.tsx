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
    <div className="flex items-center gap-2 p-5">
      <SearchIcon />
      <Link
        className="flex items-center"
        onClick={() => {
          setSearchQueryInput("");
          setOpenPopup(false);
        }}
        href={`/profile/${user.account_address}`}
      >
        <span
          className={`text-sm font-medium text-white hover:text-brand-primary  ${
            user.display_name.includes(" ")
              ? "text-ellipsis line-clamp-1"
              : "whitespace-no-wrap block w-full max-w-full overflow-hidden truncate"
          }`}
          title={user.display_name}
        >
          {user && sliceDisplayName(user.display_name)}
        </span>
        {!!verificationTick && (
          <span className="verifiedIcon ml-0.5 h-5 w-5 fsm:ml-1">
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
