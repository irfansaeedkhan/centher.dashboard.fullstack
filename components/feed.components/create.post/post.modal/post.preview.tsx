import React from "react";

interface Props {
  posts: any;
}

const PostPreview = ({ posts }: Props) => {
  return (
    <div className="mb-3 space-y-3">
      {posts?.map((media: any, index: number) => (
        <div
          key={index}
          className="rounded-[10px] bg-black-shade-9 px-4 py-3 text-sm font-semibold text-white opacity-50"
        >
          {media.post_text}
        </div>
      ))}
    </div>
  );
};

export default PostPreview;
