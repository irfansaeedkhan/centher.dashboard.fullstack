import React, { useMemo } from "react";

import { INewPost } from "@/store/new.post.store";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

interface Props {
  post: INewPost;
  removePost: (uuid: string) => void;
}

const PostPreview = ({ post, removePost }: Props) => {
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
    <div className="group mb-3 rounded-[10px] border border-[#0d0d0d] bg-black-shade-9">
      <div
        className={clsx(`relative grid gap-2`, {
          "grid-cols-2": post.media.length === 2,
          "grid-cols-2 fsm:grid-cols-3": post.media.length >= 3,
        })}
      >
        {postFiles.length > 0 && (
          <button
            className="absolute top-2 right-1 z-10 hidden rounded-md bg-white/10 p-1 group-hover:block"
            onClick={() => removePost(post.uuid)}
          >
            <IoClose className="h-5 w-5 fill-white text-white" />
          </button>
        )}
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
      {post.post_text && (
        <div
          key={post.uuid}
          className="relative break-words rounded-b-[10px] px-4 py-3 text-sm font-semibold text-white opacity-50"
        >
          {post.post_text}
          {postFiles.length === 0 && (
            <button
              className="absolute top-2 right-2 z-10 hidden rounded-md bg-white/10 p-1 group-hover:block"
              onClick={() => removePost(post.uuid)}
            >
              <IoClose className="h-5 w-5 fill-white text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostPreview;
