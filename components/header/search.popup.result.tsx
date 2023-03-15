import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";

import { User } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { SearchIcon } from "@/assets/svgs";

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
    <div className="flex items-start gap-2 p-5">
      {/* <SearchIcon /> */}
      <Link
        className="flex items-center text-sm font-medium text-white hover:text-brand-primary"
        onClick={() => {
          setSearchQueryInput("");
          setOpenPopup(false);
        }}
        href={`/profile/${user.account_address}`}
      >
        <span
          title={user.display_name}
          className={clsx(
            `block w-full max-w-[346px] overflow-hidden truncate [@media(min-width:890px)]:max-w-[468px]`
          )}
        >
          {user && sliceDisplayName(user.display_name)}
        </span>
        {!!verificationTick && (
          <span className="verifiedIcon ml-0.5  h-5 w-5 min-w-[1.25rem]  fsm:ml-1">
            <Image
              src={"/images/rainbow-last-frame.png"}
              alt={"Verified"}
              width={20}
              height={20}
              className="mt-[1px]"
            />
          </span>
        )}
      </Link>
    </div>
  );
};

export default SearchPopupResult;
