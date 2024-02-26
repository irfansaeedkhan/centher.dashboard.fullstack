import React, { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { IoClose, IoCrop } from "react-icons/io5";
import { usePostEditorStore } from "@/store/post-editor-store";
import CropperPostMediaImage from "@/pages/profile/[user_id]/_components/cropper.postmedia.image";
import cn from "@/utils/cn";
import { IEditorPost } from "../shared/types";

export type PostImageCropperData = {
  preview: string;
  fileID: string;
};

interface Props {
  postUUID: string;
  media: IEditorPost["media"];
}

export const FilesPreview: React.FC<Props> = React.memo(
  ({ postUUID, media }) => {
    const { modalType, isSubmitting } = usePostEditorStore(
      useShallow((state) => ({
        modalType: state.modalType,
        isSubmitting: state.isSubmitting,
      }))
    );
    const { removeSelectedFile, removeEditPostFile, setSelectedFiles } =
      usePostEditorStore(useShallow((state) => state.actions));
    const [cropImageSrc, setCropImageSrc] = useState<PostImageCropperData>({
      preview: "",
      fileID: "",
    });

    const postFiles = useMemo(() => {
      if (modalType === "edit") {
        return media
          .filter((file) => file.type === "edit" && !file.isDeleted)
          .map((file) => {
            if (file.type === "edit") {
              return {
                ...file,
                src: file.original.url,
              };
            }
            return {
              ...file,
              src: URL.createObjectURL(file.original),
            };
          });
      } else {
        return media.map((file) => {
          if (file.type === "edit") {
            return {
              ...file,
              src: file.original.url,
            };
          }
          return {
            ...file,
            src: URL.createObjectURL(file.original),
          };
        });
      }
    }, [modalType, media]);

    return (
      <div
        className={cn(
          `mb-4 grid max-h-[45dvh] grid-cols-2 grid-rows-2 gap-[6px] fsm:gap-3`
        )}
      >
        {postFiles.map((file, index) => {
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

          return (
            <div
              key={file.uuid}
              className={cn(
                `relative`,
                {
                  "col-span-2 row-span-2": postFiles.length === 1,
                },
                {
                  "col-span-1 row-span-2": postFiles.length === 2,
                },
                {
                  "col-span-1 row-span-2":
                    index === 0 && postFiles.length === 3,
                  "col-span-1 row-span-1":
                    postFiles.length === 3 && (index === 1 || index === 2),
                },
                {
                  "col-span-1 row-span-1": postFiles.length === 4,
                },
                isSubmitting && "pointer-events-none"
              )}
            >
              <CloseButton
                className="absolute right-1 top-1 z-10"
                onClick={() => {
                  if (modalType === "edit") {
                    removeEditPostFile(postUUID, file.uuid);
                  } else {
                    removeSelectedFile(postUUID, file.uuid);
                  }
                }}
              />
              {file.original.type.startsWith("image") &&
                file.type === "new" && (
                  <CropButton
                    className="absolute left-1 top-1 z-10"
                    onClick={() => {
                      setCropImageSrc({
                        preview: URL.createObjectURL(file.original),
                        fileID: file.uuid,
                      });
                    }}
                  />
                )}

              {media}
            </div>
          );
        })}

        {modalType !== "edit" && (
          <CropperPostMediaImage
            cropImageSrc={cropImageSrc}
            onClose={() => {
              setCropImageSrc({
                preview: "",
                fileID: "",
              });
            }}
            onCrop={(croppedImage) => {
              const croppedSelectedFiles = media.map((file) => {
                if (file.uuid === cropImageSrc.fileID && file.type === "new") {
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
        )}
      </div>
    );
  }
);

FilesPreview.displayName = "FilesPreview";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CloseButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button className={cn(`rounded-md bg-black/40 p-1`, className)} {...props}>
      <IoClose className="h-4 w-4 fill-white" />
    </button>
  );
};

const CropButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button className={cn(`rounded-md bg-black/40 p-1`, className)} {...props}>
      <IoCrop className="h-4 w-4 fill-white" />
    </button>
  );
};
