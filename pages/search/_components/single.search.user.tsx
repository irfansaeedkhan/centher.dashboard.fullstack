import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { sliceAccountAddress } from "@/utils/user.helpers";

import type { SearchResult } from "./types";

interface SingleSearchUserProps {
  result: SearchResult;
}

const SingleSearchUser: React.FC<SingleSearchUserProps> = ({ result }) => {
  const [_result, setResult] = useState<SearchResult>(result);
  const { user: loggedInUser } = useUser();

  const followUser = async (following_id: string) => {
    try {
      setResult((prev) => ({
        ...prev,
        is_followed_by_loggedin_user: !prev.is_followed_by_loggedin_user,
      }));

      await axiosNodeApi.post("api/socials/follows", {
        following_id,
      });
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <div className="p-4 bg-background-shade-3 rounded-lg flex gap-10 items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href={`/profile/${_result.account_address}`}>
          <Image
            src={_result.profile_image.path}
            alt=""
            width={40}
            height={40}
            className="!w-10 !h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex flex-col gap-1">
          <Link
            href={`/profile/${_result.account_address}`}
            className="text-base font-semibold text-white hover:text-brand-primary"
          >
            {_result.display_name}
          </Link>
          <div className="text-sm text-gray-shade-2">
            {sliceAccountAddress(_result.account_address)}
          </div>
        </div>
      </div>
      {loggedInUser?._id !== _result._id && (
        <button
          className={clsx(
            _result.is_followed_by_loggedin_user
              ? followingButton
              : connectButton
          )}
          onClick={() => followUser(_result._id)}
        >
          {_result.is_followed_by_loggedin_user ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default SingleSearchUser;

const connectButton = ctl(`
  px-6 
  py-2
  flex
  text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-brand-primary-dark 
`);
const followingButton = ctl(`
  px-6 
  py-2
  flex
  text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-gray-shade-3 
  text-gray-shade-7
`);
