import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { IoClose, IoCrop } from "react-icons/io5";

import { useNewPostStore } from "@/store/new.post.store";
import CropperPostMediaImage from "@/pages/profile/[account_address]/_components/cropper.postmedia.image";

export type PostImageCropperData = {
  preview: string;
  fileID: string;
};

export const FilesPreview = () => {
  const {
    modalType,
    selectedFiles,
    removeSelectedFile,
    editPostFiles,
    setSelectedFiles,
    removeEditPostFile,
  } = useNewPostStore();
  const [cropImageSrc, setCropImageSrc] = useState<PostImageCropperData>({
    preview: "",
    fileID: "",
  });

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
            {file.original.type.startsWith("image") && (
              <CropButton
                className="absolute top-1 left-1 z-10"
                onClick={() => {
                  setCropImageSrc({
                    preview: URL.createObjectURL(
                      file.original instanceof File
                        ? file.original
                        : new Blob([file.original.url])
                    ),
                    fileID: file.id,
                  });
                }}
              />
            )}

            {media}
          </div>
        );
      })}

      <CropperPostMediaImage
        cropImageSrc={cropImageSrc}
        onClose={() => {
          setCropImageSrc({
            preview: "",
            fileID: "",
          });
        }}
        onCrop={(croppedImage) => {
          const croppedSelectedFiles = selectedFiles.map((file) => {
            if (file.id === cropImageSrc.fileID) {
              return {
                ...file,
                original: croppedImage.original,
              };
            }
            return file;
          });
          setSelectedFiles(croppedSelectedFiles);
        }}
      />
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

const CropButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={clsx(`rounded-md bg-black/40 p-1`, className)}
      {...props}
    >
      <IoCrop className="h-4 w-4 fill-white" />
    </button>
  );
};
