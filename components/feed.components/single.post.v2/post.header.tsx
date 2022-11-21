import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

import { PostActionMenu } from "./post.action.meu";

dayjs.extend(relativeTime);

interface Props {
  post: CompletedPost;
  postType: "main" | "reply" | "reply-w-parent-header" | "archived";
  onClickDelete: () => Promise<void>;
  onClickEdit: () => Promise<void>;
  onClickArchive: () => Promise<void>;
}

export const PostHeader: React.FC<Props> = ({
  post,
  postType,
  onClickEdit,
  onClickDelete,
  onClickArchive,
}) => {
  // Considering postType === "main"
  return (
    <div className="flex items-center justify-between">
      {/* Left Side */}
      <div className="left-side flex gap-x-3">
        {/* Image with link to user profile */}
        <Link
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
            className="rounded-full"
          />
        </Link>

        <div>
          {/* Display Name */}
          <Link
            href={{
              pathname: AppRoutes.profile.account_address,
              query: { account_address: post.user.account_address },
            }}
            className="text-white font-semibold text-sm block"
          >
            {post.user.display_name}
          </Link>

          {/* Time */}
          <p className="text-gray-shade-7 text-xs font-medium">
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        {/* 3 dots menu */}
        <PostActionMenu
          onClickEdit={onClickEdit}
          onClickArchive={onClickArchive}
          onClickDelete={onClickDelete}
        />
      </div>
    </div>
  );
};
