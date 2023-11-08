import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import {
  ArchivedPost,
  CompletedPost,
  ParentPost,
  PostUser,
} from "@/models/post";
import { LoggedInUser } from "@/models/user";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { PostActionMenu } from "./post.action.meu";
import { PostType } from "./main";

interface Props {
  post: CompletedPost | ArchivedPost;
  parentPost: ParentPost | undefined;
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
  parentPost,
  postUser,
  postType,
  loggedInUser,
  onClickEdit,
  onClickDelete,
  onClickArchive,
  onClickRestore,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const isPostOwner = useMemo(() => {
    return loggedInUser?._id.toLowerCase() === postUser._id.toLowerCase();
  }, [loggedInUser?._id, postUser._id]);

  const isBefore15Minutes = useMemo(() => {
    return dayjs().diff(dayjs(post.createdAt), "minute") < 15;
  }, [post.createdAt]);

  const createdTime = useMemo(() => {
    // Show relative time under 7 days
    let createdAt = post.createdAt;
    if (
      (postType === "reply-w-parent-header" ||
        postType === "thread-post-w-parent-header") &&
      post.status !== "archived" &&
      parentPost
    ) {
      createdAt = parentPost.createdAt;
    }

    try {
      return dayjs().diff(dayjs(new Date(createdAt)), "day") < 7
        ? dayjs(new Date(createdAt)).fromNow()
        : dayjs().diff(dayjs(new Date(createdAt)), "day") > 365
        ? dayjs(new Date(createdAt)).format("D MMM, YYYY")
        : dayjs(new Date(createdAt)).format("D MMM");
    } catch (error) {
      // There is some issue with dayjs, so we are returning 2s as a fallback
      return "2s";
    }
  }, [post, postType, parentPost]);

  const verificationTickPostCreator = useVerificationTick({ user: post.user });
  const verificationTickReplyingTo = useVerificationTick({
    user: parentPost ? parentPost.user : null,
  });

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.offsetWidth - 40;
      if (newWidth !== containerWidth) {
        setContainerWidth(newWidth);
      }
    };
    window.addEventListener("resize", updateWidth);
    updateWidth(); // Move this line inside the event listener

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [containerWidth]);

  return (
    <div ref={containerRef} className="flex justify-between">
      <div
        className={` truncate break-words`}
        style={{ maxWidth: `${containerWidth}px` }}
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
                pathname: AppRoutes.profile.user_id,
                query: { user_id: postUser._id },
              }}
              className={clsx(
                `word-break text-gradient-hover flex w-full max-w-max items-center truncate text-sm font-semibold text-white`
              )}
              title={postUser.display_name}
            >
              <span className={clsx(`block truncate break-words`)}>
                {postUser && sliceDisplayName(postUser.display_name)}
              </span>
              {verificationTickPostCreator && (
                <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                  <Image
                    src={verificationTickPostCreator}
                    alt={
                      postUser.membership.status === "citizen"
                        ? "Citizen"
                        : "Verified"
                    }
                    width={16}
                    height={16}
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

          {parentPost && postType === "reply" && post.status !== "archived" && (
            <>
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={{
                  pathname: AppRoutes.profile.user_id,
                  query: {
                    user_id: parentPost.user._id,
                  },
                }}
                className="word-break group mt-0.5 flex items-center truncate text-xs font-medium text-white"
              >
                <span className="mr-1 min-w-max text-xs font-medium text-gray-shade-7">
                  Replying to
                </span>
                <span
                  className={clsx(
                    `group-hover:text-white/75`,
                    `block truncate break-words`
                  )}
                  title={parentPost.user.display_name}
                >
                  {post && sliceDisplayName(parentPost.user.display_name)}
                </span>
                {verificationTickReplyingTo && (
                  <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                    <Image
                      src={verificationTickReplyingTo}
                      alt={
                        parentPost.user.membership.status === "citizen"
                          ? "Citizen"
                          : "Verified"
                      }
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Right Side */}
      {isPostOwner &&
        postType !== "reply-w-parent-header" &&
        postType !== "thread-post-w-parent-header" && (
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
      {(postType === "reply-w-parent-header" ||
        postType === "thread-post-w-parent-header") &&
        parentPost &&
        post.status !== "archived" && (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={{
              pathname: AppRoutes.feed.single_post,
              query: {
                post_id: parentPost._id,
              },
            }}
          >
            <Button
              title={
                postType === "thread-post-w-parent-header"
                  ? "View Thread"
                  : "View Post"
              }
              variant="primary"
              className="h-10 w-[100px] text-xs"
              borderRounded="14px"
            />
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
