import React, { useMemo } from "react";

import { INewPost } from "@/store/new.post.store";
import clsx from "clsx";

interface Props {
  post: INewPost;
}

const PostPreview = ({ post }: Props) => {
  const postFiles = useMemo(() => {
    return post.media.map((file) => {
      return {
        ...file,
        src:
          file.type === "new"
            ? URL.createObjectURL(file.original)
            : file.original.url,
      };
    });
  }, [post]);

  return (
    <div className="mb-3 space-y-3">
      <div
        className={clsx(`grid gap-2`, {
          "grid-cols-2": post.media.length === 2,
          "grid-cols-2 fsm:grid-cols-3": post.media.length >= 3,
        })}
      >
        {postFiles.map((file) => {
          let media: React.ReactNode = null;
          if (file.original.type.startsWith("image")) {
            media = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.src}
                alt={
                  file.type === "new" ? file.original.name : file.original.url
                }
                className={`h-full max-h-[480px] w-full rounded-10px object-cover`}
              />
            );
          } else if (file.original.type.startsWith("video")) {
            media = (
              <video
                src={file.src}
                className={`h-full max-h-[480px] w-full rounded-10px object-cover`}
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
            );
          }

          return media;
        })}
      </div>
      <div
        key={post.uuid}
        className="rounded-[10px] bg-black-shade-9 px-4 py-3 text-sm font-semibold text-white opacity-50"
      >
        {post.post_text}
      </div>
    </div>
  );
};

export default PostPreview;
