import React from "react";
import Image from "next/image";
import clsx from "clsx";

import { useNewPostStore } from "@/store/new.post.store";
import useUser from "@/hooks/use.user";

import { PostModalContainer } from "./post.modal.container";
import { FilesPreview } from "./files.preview";

interface Props {
  modalTitle: string;
}

export const CreatePostModal: React.FC<Props> = ({ modalTitle }) => {
  const { user } = useUser();
  const {
    selectedFiles,
    closeModal,
    isModalOpen,
    postText,
    setPostText,
    postTextMaxLength,
  } = useNewPostStore();

  if (!user) {
    return null;
  }

  return (
    <PostModalContainer
      isOpen={isModalOpen}
      onClickClose={closeModal}
      title={modalTitle}
    >
      <div
        className={`flex flex-col gap-4 w-full px-3 fsm:px-6 py-4 border-b-2 border-gray-shade-3 border-opacity-40`}
      >
        <div className={`flex items-center gap-3`}>
          <Image
            src={user.profile_image.path}
            width={44}
            height={44}
            className="rounded-full object-cover w-[44px] h-[44px]"
            alt={user.display_name ?? "profile image"}
            sizes={"256px"}
          />
          <h5 className={`text-14px font-semibold text-white`}>
            {user.display_name}
          </h5>
        </div>

        <div>
          <FilesPreview />

          <div className={clsx(`w-full`, !!selectedFiles.length && "mt-4")}>
            <textarea
              className={`block w-full text-xs fsm:text-14px rounded-10px leading-6 text-white font-medium bg-background-shade-3 break-all border-none outline-none resize-none focus:ring-0 px-4 py-3.5`}
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
  );
};
