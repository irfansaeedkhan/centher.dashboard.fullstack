import { AppRoutes } from "@/constants/app.routes";
import { ParentPost } from "@/models/post";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  parentPost: ParentPost;
}

const ParentPost: React.FC<Props> = ({ parentPost }) => {
  return (
    <div className="px-4">
      <div className="flex gap-2 items-center relative">
        <div className="h-9 w-[1px] bg-gray-shade-3 absolute -bottom-[2.3rem] left-[1.4rem]"></div>
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: parentPost.user.account_address,
            },
          }}
          className="cursor-pointer !w-[48px] !h-[48px]"
        >
          <Image
            src={parentPost.user.profile_image.path}
            width={48}
            height={48}
            className="rounded-full cursor-pointer w-[48px] h-[48px] object-cover"
            alt={parentPost.user.display_name}
            sizes="256px"
          />
        </Link>
        <div className="flex justify-between gap-10 flex-grow relative">
          <Link
            href={{
              pathname: AppRoutes.profile.account_address,
              query: {
                account_address: parentPost.user.account_address,
              },
            }}
          >
            <h1 className="text-sm text-white font-semibold">
              {parentPost.user.display_name}
            </h1>
            <h4 className={`text-12px font-ligth text-gray-shade-7`}>
              {moment(parentPost.createdAt).format("MMM Do")} at{" "}
              {moment(parentPost.createdAt).format("LT")}
            </h4>
          </Link>
          <Link
            href={{
              pathname: AppRoutes.feed.single_post,
              query: {
                account_address: parentPost.user.account_address,
                post_id: parentPost._id,
              },
            }}
            className="w-fit h-9 py-2 px-4 !text-xs text-white bg-black-shade-7 rounded-xl flex justify-end items-center"
          >
            View post
          </Link>
          <div className="h-[1px] bg-gray-shade-3 -bottom-5 absolute w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ParentPost;
