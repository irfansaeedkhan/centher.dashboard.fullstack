import React, { useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

import { PostActionMenu } from "./post.action.meu";
import { LoggedInUser } from "@/models/user";

dayjs.extend(relativeTime);

interface Props {
  post: CompletedPost;
  postType: "main" | "reply" | "reply-w-parent-header" | "archived";
  loggedInUser: LoggedInUser | undefined;
  onClickDelete: () => Promise<void>;
  onClickEdit: () => Promise<void>;
  onClickArchive: () => Promise<void>;
}

export const PostHeader: React.FC<Props> = ({
  post,
  postType,
  loggedInUser,
  onClickEdit,
  onClickDelete,
  onClickArchive,
}) => {
  const isPostOwner = useMemo(() => {
    return (
      loggedInUser?.account_address.toLowerCase() ===
      post.user.account_address.toLowerCase()
    );
  }, [loggedInUser?.account_address, post.user.account_address]);

  const isBefore15Minutes = useMemo(() => {
    return dayjs().diff(dayjs(post.createdAt), "minute") < 15;
  }, [post.createdAt]);

  // Considering postType === "main"
  return (
    <div className="flex justify-between">
      {/* Left Side */}
      <div className="left-side">
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

      {/* Right Side */}
      {isPostOwner && (
        <div className="right-side">
          {/* 3 dots menu */}
          <PostActionMenu
            isBefore15Minutes={isBefore15Minutes}
            onClickEdit={onClickEdit}
            onClickArchive={onClickArchive}
            onClickDelete={onClickDelete}
          />
        </div>
      )}
    </div>
  );
};
