import React, { useMemo } from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

import { useNewPostStore } from "@/store/new.post.store";

export const FilesPreview = () => {
  const { selectedFiles, removeSelectedFile } = useNewPostStore();

  const filesWithObjectURL = useMemo(() => {
    return selectedFiles.map((file) => {
      return {
        ...file,
        objectURL: URL.createObjectURL(file.original),
      };
    });
  }, [selectedFiles]);

  return (
    <div
      className={clsx(`grid gap-2`, {
        "grid-cols-2": filesWithObjectURL.length === 2,
        "grid-cols-3": filesWithObjectURL.length >= 3,
        "grid-row-2": filesWithObjectURL.length > 3,
      })}
    >
      {filesWithObjectURL.map((file) => {
        let media: React.ReactNode = null;
        if (file.original.type.startsWith("image")) {
          media = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.objectURL}
              alt={file.original.name}
              className={`w-full h-full max-h-[480px] object-cover rounded-10px`}
            />
          );
        } else if (file.original.type.startsWith("video")) {
          media = (
            <video
              src={file.objectURL}
              className={`w-full h-full max-h-[480px] object-cover rounded-10px`}
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
              onClick={() => removeSelectedFile(file.id)}
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
      className={clsx(`p-1 rounded-md bg-black/40`, className)}
      {...props}
    >
      <IoClose className="w-4 h-4 fill-white" />
    </button>
  );
};
