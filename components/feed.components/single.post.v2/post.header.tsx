import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { ArchivedPost, CompletedPost, PostUser } from "@/models/post";
import { LoggedInUser } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import useGetUser from "@/hooks/use.get.user";

import { PostActionMenu } from "./post.action.meu";
import { PostType } from "./main";

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
  const [postOwnerAddress, setPostOwnerAddress] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (
      postType === "reply" &&
      post.status !== "archived" &&
      post?.parent_post?.user?.account_address
    ) {
      setPostOwnerAddress(post?.parent_post.user?.account_address);
    }
  }, [post, postType]);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.offsetWidth;

      if (newWidth !== containerWidth) {
        setContainerWidth(newWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [containerWidth]);
  const { user } = useGetUser(postUser.account_address);
  const { user: replyPostUser } = useGetUser(postOwnerAddress);

  const isPostOwner = useMemo(() => {
    return (
      loggedInUser?.account_address.toLowerCase() ===
      postUser.account_address.toLowerCase()
    );
  }, [loggedInUser?.account_address, postUser.account_address]);

  const isBefore15Minutes = useMemo(() => {
    return dayjs().diff(dayjs(post.createdAt), "minute") < 15;
  }, [post.createdAt]);

  const createdTime = useMemo(() => {
    // Show relative time under 7 days
    const createdAt =
      postType === "reply-w-parent-header" &&
      post.status !== "archived" &&
      post.parent_post
        ? post.parent_post.createdAt
        : post.createdAt;

    try {
      return dayjs().diff(dayjs(new Date(createdAt)), "day") < 7
        ? dayjs(new Date(createdAt)).fromNow()
        : dayjs(new Date(createdAt)).format("D MMM");
    } catch (error) {
      // There is some issue with dayjs, so we are returning 2s as a fallback
      return "2s";
    }
  }, [post, postType]);

  const verificationTickMainPost = useVerificationTick({ user });
  const verificationTickReplyPost = useVerificationTick({
    user: replyPostUser,
  });

  return (
    <div ref={containerRef} className="flex justify-between">
      <div
        className={` truncate break-words`}
        style={{ maxWidth: `${containerWidth - 30}px` }}
      >
        {/* Left Side */}
        <div className="left-side word-break mr-2 truncate">
          {/* Display Name */}
          <div
            className={clsx(
              `word-break truncate`,
              postType === "reply" && `flex items-center`
            )}
          >
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={{
                pathname: AppRoutes.profile.account_address,
                query: { account_address: postUser.account_address },
              }}
              className={clsx(
                `word-break flex w-full max-w-max items-center truncate text-sm font-semibold text-white hover:text-brand-primary`
              )}
              title={postUser.display_name}
            >
              <span className={clsx(`block truncate break-words`)}>
                {postUser && sliceDisplayName(postUser.display_name)}
              </span>
              {!!verificationTickMainPost && (
                <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                  <Image
                    src={verificationTickMainPost}
                    alt={"Verified"}
                    width={20}
                    height={20}
                  />
                </span>
              )}
            </Link>

            {/* Time */}
            <p
              className={clsx(
                `text-xs font-medium text-gray-shade-7`,
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
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={{
                  pathname: AppRoutes.profile.account_address,
                  query: {
                    account_address: post.parent_post?.user.account_address,
                  },
                }}
                className="word-break group mt-0.5 flex items-center truncate text-xs font-medium text-white"
              >
                <span className="mr-1 min-w-max text-xs font-medium text-gray-shade-7">
                  Replying to
                </span>
                <span
                  className={clsx(
                    `group-hover:text-brand-primary`,
                    `block truncate break-words`
                  )}
                  title={post?.parent_post?.user.display_name}
                >
                  {post &&
                    sliceDisplayName(post?.parent_post?.user.display_name)}
                </span>
                {!!verificationTickReplyPost && (
                  <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                    <Image
                      src={verificationTickReplyPost}
                      alt={"Verified"}
                      width={20}
                      height={20}
                    />
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
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
              post_id: post.parent_post?._id,
            },
          }}
          className="flex min-w-max items-center rounded-xl bg-black-shade-7 py-1.5 px-3 text-xs text-white"
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
