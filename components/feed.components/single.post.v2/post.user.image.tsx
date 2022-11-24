import React from "react";
import Image from "next/image";
import Link from "next/link";

import { CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  post: CompletedPost;
  shouldShowThread: boolean;
}

export const PostUserImage: React.FC<Props> = ({ post, shouldShowThread }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Image with link to user profile */}
      <Link
        className="w-12 h-12"
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: post.user.account_address },
        }}
      >
        <Image
          src={post.user.profile_image.path}
          alt={post.user.display_name}
          width={48}
          height={48}
          sizes="48px"
          className="rounded-full object-cover w-full h-full"
        />
      </Link>

      {/* Vertical Line */}
      {shouldShowThread && (
        <div className="flex-grow border-l-2 border-gray-shade-3" />
      )}
    </div>
  );
};
