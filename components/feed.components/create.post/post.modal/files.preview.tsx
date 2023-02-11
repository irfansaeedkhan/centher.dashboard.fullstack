import React, { useMemo } from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

import { useNewPostStore } from "@/store/new.post.store";

export const FilesPreview = () => {
  const {
    modalType,
    selectedFiles,
    removeSelectedFile,
    editPostFiles,
    removeEditPostFile,
  } = useNewPostStore();

  const postFiles = useMemo(() => {
    if (modalType === "edit") {
      return editPostFiles
        ? editPostFiles
            .filter((f) => !f.isDeleted)
            .map((file) => {
              return {
                ...file,
                original: {
                  ...file.original,
                  name: file.original.url,
                },
                src: file.original.url,
              };
            })
        : [];
    } else {
      return selectedFiles.map((file) => {
        return {
          ...file,
          src: URL.createObjectURL(file.original),
        };
      });
    }
  }, [selectedFiles, modalType, editPostFiles]);

  return (
    <div
      className={clsx(`grid gap-2`, {
        "grid-cols-2": postFiles.length === 2,
        "grid-cols-2 fsm:grid-cols-3": postFiles.length >= 3,
      })}
    >
      {postFiles.map((file) => {
        let media: React.ReactNode = null;
        if (file.original.type.startsWith("image")) {
          media = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.src}
              alt={file.original.name}
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

        return (
          <div key={file.id} className={`relative`}>
            <CloseButton
              className="absolute top-1 right-1 z-10"
              onClick={() => {
                if (modalType === "edit") {
                  removeEditPostFile(file.id);
                } else {
                  removeSelectedFile(file.id);
                }
              }}
            />
            {media}
          </div>
        );
      })}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CloseButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={clsx(`rounded-md bg-black/40 p-1`, className)}
      {...props}
    >
      <IoClose className="h-4 w-4 fill-white" />
    </button>
  );
};
