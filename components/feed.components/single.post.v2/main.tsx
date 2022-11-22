import React from "react";
import clsx from "clsx";

import useUser from "@/hooks/use.user";
import { CompletedPost } from "@/models/post";

import { PostHeader } from "./post.header";
import { PostMedia } from "./post.media";
import { PostTextContent } from "./post.text.content";
import { PostFooter } from "./post.footer";

interface Props {
  post: CompletedPost;
  postType: "main" | "reply" | "reply-w-parent-header" | "archived";
  onClickReply?: () => void;
  onClickEdit?: () => Promise<void>;
  onClickArchive?: () => Promise<void>;
  onClickDelete?: () => Promise<void>;
}

export const SinglePostV2: React.FC<Props> = ({
  post,
  postType,
  onClickReply = () => {},
  onClickArchive = async () => {},
  onClickDelete = async () => {},
  onClickEdit = async () => {},
}) => {
  const { user: loggedInUser } = useUser();

  return (
    <div
      className={clsx(`w-full max-w-[544px] bg-elevation-1 rounded-10px p-4`)}
    >
      <PostHeader
        post={post}
        postType={postType}
        loggedInUser={loggedInUser}
        onClickArchive={onClickArchive}
        onClickDelete={onClickDelete}
        onClickEdit={onClickEdit}
      />

      {post.media && !!post.media.length && <PostMedia post={post} />}

      {post.text_content && <PostTextContent post={post} />}

      <PostFooter post={post} onClickReply={onClickReply} />
    </div>
  );
};
