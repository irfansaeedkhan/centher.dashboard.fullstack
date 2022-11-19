import React from "react";
import clsx from "clsx";

import { Post } from "@/models/post";

import { PostHeader } from "./post.header";

interface Props {
  post: Post;
  postType: "main" | "reply" | "reply-w-parent-header" | "archived";
  onClickEdit?: () => Promise<void>;
  onClickArchive?: () => Promise<void>;
  onClickDelete?: () => Promise<void>;
}

export const SinglePostV2: React.FC<Props> = ({
  post,
  postType,
  onClickArchive = async () => {},
  onClickDelete = async () => {},
  onClickEdit = async () => {},
}) => {
  return (
    <div
      className={clsx(`w-full max-w-[544px] bg-elevation-1 rounded-10px p-4`)}
    >
      <PostHeader
        post={post}
        postType={postType}
        onClickArchive={onClickArchive}
        onClickDelete={onClickDelete}
        onClickEdit={onClickEdit}
      />
    </div>
  );
};
