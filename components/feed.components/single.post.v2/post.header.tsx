import React, { useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { CompletedPost } from "@/models/post";
import { LoggedInUser } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

import { PostActionMenu } from "./post.action.meu";
import clsx from "clsx";

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

  const createdTime = useMemo(() => {
    // Show relative time under 7 days
    return dayjs().diff(dayjs(new Date(post.createdAt)), "day") < 7
      ? dayjs(new Date(post.createdAt)).fromNow()
      : dayjs(new Date(post.createdAt)).format("D MMM");
  }, [post.createdAt]);

  return (
    <div className="flex justify-between">
      {/* Left Side */}
      <div className="left-side">
        {/* Display Name */}
        <div className={clsx(postType === "reply" && `flex items-center`)}>
          <Link
            href={{
              pathname: AppRoutes.profile.account_address,
              query: { account_address: post.user.account_address },
            }}
            className="text-white font-semibold text-sm"
          >
            {post.user.display_name}
          </Link>

          {/* Time */}
          <p
            className={clsx(
              `text-gray-shade-7 text-xs font-medium`,
              postType === "reply" && "ml-3"
            )}
          >
            {createdTime}
          </p>
        </div>

        {postType === "reply" && (
          <>
            <span className="inline-block text-gray-shade-7 font-medium text-xs">
              Replying to
            </span>
            <Link
              href={{
                pathname: AppRoutes.profile.account_address,
                query: {
                  account_address: post.parent_post?.user.account_address,
                },
              }}
              className="inline-block ml-1 text-white font-medium text-xs"
            >
              {post.parent_post?.user.display_name}
            </Link>
          </>
        )}
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

// Reset threshold for relative time
dayjs.extend(relativeTime, {
  thresholds: [
    { l: "s", r: 1 },
    { l: "ss", r: 59, d: "second" },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
  ],
});

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    past: "%s",
    s: "%ds",
    ss: "%ds",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
  },
});
