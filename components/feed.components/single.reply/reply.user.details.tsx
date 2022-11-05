import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

import { CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface ReplyUserDetailsProps {
  post: CompletedPost;
}

const ReplyUserDetails: React.FC<ReplyUserDetailsProps> = ({ post }) => {
  return (
    <Link
      href={{
        pathname: AppRoutes.profile.account_address,
        query: {
          account_address: post.user.account_address,
        },
      }}
      className="cursor-pointer !w-[48px] !h-[48px]"
    >
      <Image
        src={post.user.profile_image.path}
        width={48}
        height={48}
        className="rounded-full cursor-pointer w-[48px] h-[48px] object-cover"
        alt={post.user.display_name}
        sizes="256px"
      />
    </Link>
  );
};

export default ReplyUserDetails;
