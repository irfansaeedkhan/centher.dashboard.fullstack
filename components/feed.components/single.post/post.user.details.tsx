import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

import { CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface PostUserDetailsProps {
  post: CompletedPost;
}

const PostUserDetails: React.FC<PostUserDetailsProps> = ({ post }) => {
  return (
    <div className={`flex items-center gap-3`}>
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: post.user.account_address,
          },
        }}
      >
        <Image
          src={post.user.profile_image.path}
          width={48}
          height={48}
          className="rounded-full cursor-pointer w-[48px] h-[48px] object-cover border border-gray-shade-3"
          alt={post.user.display_name}
          sizes="256px"
        />
      </Link>

      <div>
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: post.user?.account_address,
            },
          }}
          className={`text-14px font-semibold text-white pb-1 cursor-pointer`}
        >
          {post.user.display_name}
        </Link>

        <div className={`text-12px font-ligth text-gray-shade-7`}>
          {moment(post.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default PostUserDetails;
