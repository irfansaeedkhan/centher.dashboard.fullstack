import React from "react";

import { INewPost } from "@/store/new.post.store";

interface Props {
  posts: INewPost[];
}

const PostPreview = ({ posts }: Props) => {
  return (
    <div className="mb-3 space-y-3">
      {posts.slice(0, -1).map((post) => (
        <div
          key={post.uuid}
          className="rounded-[10px] bg-black-shade-9 px-4 py-3 text-sm font-semibold text-white opacity-50"
        >
          {post.post_text}
        </div>
      ))}
    </div>
  );
};

export default PostPreview;
