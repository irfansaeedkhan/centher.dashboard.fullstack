import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { ArchivedPost, CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  post: CompletedPost | ArchivedPost;
  shouldShowThread: boolean;
}

export const ShowThread: React.FC<Props> = ({ post, shouldShowThread }) => {
  const router = useRouter();

  if (!shouldShowThread) return null;

  return (
    <div className="flex items-center">
      {/* User Image */}
      <Image
        onClick={(e) => {
          e.stopPropagation();
          router.push({
            pathname: AppRoutes.profile.user_id,
            query: { user_id: post.user._id },
          });
        }}
        src={post.user.profile_image}
        alt={post.user.display_name}
        width={48}
        height={48}
        sizes="24px"
        className="mx-[9px] h-[30px] w-[30px] rounded-full object-cover"
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
        className="rounded-[40px] bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary"
      >
        Show Thread
      </Link>
    </div>
  );
};
