import React, { useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useNewPostStore } from "@/store/new.post.store";
import useUser from "@/hooks/use.user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

import { PostModalContainer } from "./post.modal.container";
import { FilesPreview } from "./files.preview";

interface Props {
  modalTitle: string;
}

export const PostModal: React.FC<Props> = ({ modalTitle }) => {
  const { user } = useUser();
  const {
    selectedFiles,
    editPostFiles,
    closeModal,
    isModalOpen,
    postText,
    setPostText,
    postTextMaxLength,
  } = useNewPostStore();

  const hasMedia = useMemo(() => {
    return (
      !!selectedFiles.length ||
      !!editPostFiles?.filter((f) => !f.isDeleted).length
    );
  }, [selectedFiles, editPostFiles]);

  if (!user) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <PostModalContainer
        isOpen={isModalOpen}
        onClickClose={closeModal}
        title={modalTitle}
      >
        <div
          className={`flex w-full flex-col gap-4 border-b-2 border-gray-shade-3 border-opacity-40 px-3 py-4 fsm:px-6`}
        >
          <div className={`flex items-center gap-3`}>
            <Image
              src={user.profile_image.path}
              width={44}
              height={44}
              className="h-[44px] w-[44px] rounded-full object-cover"
              alt={user.display_name ?? "profile image"}
              sizes={"256px"}
            />
            <h5
              className={clsx(
                `text-14px font-semibold text-white`,
                user.display_name.includes(" ")
                  ? "text-ellipsis line-clamp-1"
                  : "block w-full max-w-full overflow-hidden truncate"
              )}
              title={user.display_name}
            >
              {user && sliceDisplayName(user.display_name)}
            </h5>
          </div>

          <div>
            <FilesPreview />

            <div className={clsx(`w-full`, hasMedia && "mt-4")}>
              <textarea
                className={`fsm:text-14px block w-full resize-none break-words rounded-10px border-none bg-background-shade-3 px-4 py-3.5 text-xs font-medium leading-6 text-white outline-none focus:ring-0`}
                cols={12}
                rows={4}
                maxLength={postTextMaxLength}
                placeholder="Type here"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </PostModalContainer>
    </div>
  );
};
