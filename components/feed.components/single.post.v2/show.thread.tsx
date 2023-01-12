import React from "react";
import Image from "next/image";
import Link from "next/link";

import { ArchivedPost, CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  post: CompletedPost | ArchivedPost;
}

export const ShowThread: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center">
      {/* User Image */}
      <Image
        onClick={(e) => {
          e.stopPropagation();
        }}
        src={post.user.profile_image.path}
        alt={post.user.display_name}
        width={48}
        height={48}
        sizes="24px"
        className="rounded-full object-cover w-[30px] h-[30px] mx-[9px]"
      />

      <Link
        href={{
          pathname: AppRoutes.feed.single_post,
          query: {
            account_address: post.user.account_address,
            post_id: post._id,
          },
        }}
        className="text-xs text-brand-primary font-medium bg-brand-primary/10 rounded-[40px] px-3 py-1.5"
      >
        Show Comments
      </Link>
    </div>
  );
};
