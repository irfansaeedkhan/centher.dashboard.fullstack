import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { ArchivedPost, CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  post: CompletedPost | ArchivedPost;
}

export const ShowThread: React.FC<Props> = ({ post }) => {
  const router = useRouter();

  return (
    <div className="flex items-center">
      {/* User Image */}
      <Image
        onClick={(e) => {
          e.stopPropagation();
          router.push({
            pathname: AppRoutes.profile.account_address,
            query: { account_address: post.user.account_address },
          });
        }}
        src={post.user.profile_image.path}
        alt={post.user.display_name}
        width={48}
        height={48}
        sizes="24px"
        className="rounded-full object-cover w-[30px] h-[30px] mx-[9px]"
      />

      <Link
        onClick={(e) => {
          e.stopPropagation();
        }}
        href={{
          pathname: AppRoutes.feed.single_post,
          query: {
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
