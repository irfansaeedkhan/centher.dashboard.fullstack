import React from "react";
import clsx from "clsx";

import useUser from "@/hooks/use.user";
import { CompletedPost } from "@/models/post";

import { PostHeader } from "./post.header";
import { PostMedia } from "./post.media";
import { PostTextContent } from "./post.text.content";
import { PostFooter } from "./post.footer";
import { ShowThread } from "./show.thread";
import { PostUserImage } from "./post.user.image";

export type PostType = "main" | "reply" | "reply-w-parent-header" | "archived";
export type Placement =
  | "feed-page"
  | "single-post-page"
  | "profile-posts-page"
  | "profile-replies-page"
  | "profile-archived-page";

interface Props {
  post: CompletedPost;
  postType: PostType;
  placement: Placement;
  shouldShowThread?: boolean;
  className?: string;
  onClickReply?: () => void;
  onClickLike?: () => Promise<void>;
  onClickEdit?: () => Promise<void>;
  onClickArchive?: () => Promise<void>;
  onClickDelete?: () => Promise<void>;
}

export const SinglePostV2: React.FC<Props> = ({
  post,
  postType,
  placement,
  shouldShowThread = false,
  className,
  onClickReply = () => {},
  onClickLike = async () => {},
  onClickArchive = async () => {},
  onClickDelete = async () => {},
  onClickEdit = async () => {},
}) => {
  const { user: loggedInUser } = useUser();

  return (
    <div
      className={clsx(
        `w-full max-w-[544px] bg-elevation-1 p-4 rounded-10px`,
        placement === "single-post-page" &&
          postType === "main" &&
          post.replies_count > 0 &&
          "rounded-b-none",
        placement === "single-post-page" &&
          postType === "reply" &&
          "rounded-t-none rounded-b-none last:rounded-b-10px border-t border-t-gray-shade-3",
        className
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        {postType === "reply-w-parent-header" && (
          <>
            <PostUserImage
              postUser={post.parent_post?.user}
              shouldShowConnectLines={true}
            />
            <div
              className={clsx(
                `flex-grow pb-5 mb-5 border-b-2 border-b-gray-shade-3`
              )}
            >
              <PostHeader
                post={post}
                postUser={post.parent_post?.user}
                postType={postType}
                rightSide="view-post"
                loggedInUser={undefined}
                onClickArchive={undefined}
                onClickDelete={undefined}
                onClickEdit={undefined}
              />
            </div>
          </>
        )}

        <PostUserImage
          postUser={post.user}
          shouldShowConnectLines={shouldShowThread}
        />

        <div
          className={clsx(`flex-grow`, {
            "mb-2": shouldShowThread,
          })}
        >
          <PostHeader
            post={post}
            postUser={post.user}
            postType={postType}
            rightSide="action-menu"
            loggedInUser={loggedInUser}
            onClickArchive={onClickArchive}
            onClickDelete={onClickDelete}
            onClickEdit={onClickEdit}
          />

          {post.media && !!post.media.length && <PostMedia post={post} />}

          {post.text_content && (
            <PostTextContent
              post={post}
              postType={postType}
              placement={placement}
            />
          )}

          <PostFooter
            post={post}
            onClickLike={onClickLike}
            onClickReply={onClickReply}
          />
        </div>
      </div>

      {shouldShowThread && <ShowThread post={post} />}
    </div>
  );
};
