import { axiosNodeApi } from "@/utils/axios";
import { sliceAccountAddress } from "@/utils/user.helpers";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface SingleSearchUserProps {
  result: any;
}

const SingleSearchUser: React.FC<SingleSearchUserProps> = ({ result }) => {
  const [isFollow, setIsFollow] = useState(result.is_followed_by_loggedin_user);

  const followUser = async (following_id: string, name: string) => {
    try {
      const response = await axiosNodeApi.post("api/socials/follows", {
        following_id,
      });
      if (response.data.message == "follow_success") {
        setIsFollow(true);
        toast.success(`You are now following ${name}`);
      } else if (response.data.message == "unfollow_success") {
        setIsFollow(false);
        toast.success(`You are no longer following ${name}`);
      }
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };
  return (
    <div className="md:w-[544px] sm:w-full p-4 bg-background-shade-3 rounded-lg flex gap-10 items-center justify-between">
      <div className="flex gap-2 items-center">
        <Image
          src={result.profile_image.path}
          alt=""
          width={40}
          height={40}
          className="!w-10 !h-10 rounded-full object-cover"
        />

        <div className="flex flex-col gap-1">
          <Link
            href={`/profile/${result.account_address}`}
            className="text-base font-semibold text-white hover:text-brand-primary"
          >
            {result.display_name}
          </Link>
          <div className="text-sm text-gray-shade-2">
            {sliceAccountAddress(result.account_address)}
          </div>
        </div>
      </div>
      <button
        className={clsx(isFollow ? followingButton : connectButton)}
        onClick={() => followUser(result._id, result.display_name)}
      >
        {isFollow ? "Following" : "Follow"}
      </button>
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
