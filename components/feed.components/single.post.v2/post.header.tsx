import React, { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { ArchivedPost, CompletedPost, PostUser } from "@/models/post";
import { LoggedInUser } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

import { PostActionMenu } from "./post.action.meu";
import { PostType } from "./main";
import { useRouter } from "next/router";

interface Props {
  post: CompletedPost | ArchivedPost;
  postUser: PostUser;
  postType: PostType;
  loggedInUser: LoggedInUser | undefined;
  onClickEdit: (() => void) | undefined;
  onClickDelete: (() => Promise<void>) | undefined;
  onClickArchive: (() => Promise<void>) | undefined;
  onClickRestore: (() => Promise<void>) | undefined;
}

export const PostHeader: React.FC<Props> = ({
  post,
  postUser,
  postType,
  loggedInUser,
  onClickEdit,
  onClickDelete,
  onClickArchive,
  onClickRestore,
}) => {
  const isPostOwner = useMemo(() => {
    return (
      loggedInUser?.account_address.toLowerCase() ===
      postUser.account_address.toLowerCase()
    );
  }, [loggedInUser?.account_address, postUser.account_address]);

  const router = useRouter();

  const isBefore15Minutes = useMemo(() => {
    return dayjs().diff(dayjs(post.createdAt), "minute") < 15;
  }, [post.createdAt]);

  const createdTime = useMemo(() => {
    // Show relative time under 7 days
    const createdAt =
      postType === "reply-w-parent-header" &&
      post.status !== "archived" &&
      post.parent_post
        ? post.parent_post.createdAt!
        : post.createdAt;

    return dayjs().diff(dayjs(new Date(createdAt)), "day") < 7
      ? dayjs(new Date(createdAt)).fromNow()
      : dayjs(new Date(createdAt)).format("D MMM");
  }, [post, postType]);

  return (
    <div
      className="flex justify-between"
      onClick={() =>
        router.push({
          pathname: AppRoutes.feed.single_post,
          query: {
            account_address: post.user.account_address,
            post_id: post._id,
          },
        })
      }
    >
      {/* Left Side */}
      <div className="left-side mr-2">
        {/* Display Name */}
        <div className={clsx(postType === "reply" && `flex items-center`)}>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={{
              pathname: AppRoutes.profile.account_address,
              query: { account_address: postUser.account_address },
            }}
            className="text-white font-semibold text-sm text-ellipsis line-clamp-1 hover:text-brand-primary"
          >
            {postUser.display_name}
          </Link>

          {/* Time */}
          <p
            className={clsx(
              `text-gray-shade-7 text-xs font-medium`,
              postType === "reply" && "ml-3",
              postType !== "reply" && "mt-0.5"
            )}
          >
            {createdTime}
          </p>
        </div>

        {postType === "reply" && post.status !== "archived" && (
          <>
            <Link
              href={{
                pathname: AppRoutes.profile.account_address,
                query: {
                  account_address: post.parent_post?.user.account_address,
                },
              }}
              className="mt-0.5 inline-block max-w-max text-white font-medium text-xs text-ellipsis line-clamp-1 group"
            >
              <span className="inline-block mr-1 text-gray-shade-7 font-medium text-xs">
                Replying to
              </span>
              <span className="group-hover:text-brand-primary">
                {post.parent_post?.user.display_name}
              </span>
            </Link>
          </>
        )}
      </div>

      {/* Right Side */}
      {isPostOwner && postType !== "reply-w-parent-header" && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="right-side"
        >
          {/* 3 dots menu */}
          <PostActionMenu
            postType={postType}
            isBefore15Minutes={isBefore15Minutes}
            onClickEdit={onClickEdit ?? (() => {})}
            onClickArchive={onClickArchive ?? (async () => {})}
            onClickRestore={onClickRestore ?? (async () => {})}
            onClickDelete={onClickDelete ?? (async () => {})}
          />
        </div>
      )}

      {/* Right Side */}
      {postType === "reply-w-parent-header" && post.status !== "archived" && (
        <Link
          href={{
            pathname: AppRoutes.feed.single_post,
            query: {
              account_address: post.parent_post?.user.account_address,
              post_id: post.parent_post?._id,
            },
          }}
          className="min-w-max flex items-center py-1.5 px-3 text-xs text-white bg-black-shade-7 rounded-xl"
        >
          View Post
        </Link>
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
