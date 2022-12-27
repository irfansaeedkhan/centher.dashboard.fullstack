import React, { useState } from "react";
import Image from "next/image";

import { useNewPostStore } from "@/store/new.post.store";
import useUser from "@/hooks/use.user";

import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";
import { PostModal } from "../post.modal";

interface Props {}

export const CreatePostCard: React.FC<Props> = () => {
  const { user } = useUser();
  const { openModal } = useNewPostStore();
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div
      className={`w-full p-3 fsm:p-4 rounded-10px bg-background-shade-3 flex flex-col gap-4 relative`}
    >
      <div className={`top w-full flex items-center gap-2 mb-2`}>
        <Image
          src={user.profile_image.path}
          width={48}
          height={48}
          className={`rounded-full object-cover w-10 h-10 md:w-12 md:h-12`}
          alt={"icon"}
          sizes={"256px"}
        />
        <button
          className={`w-full text-14px bg-transparent rounded-10px h-10 md:h-12 border-2 border-gray-shade-3 px-6 text-gray-shade-7 font-medium text-left outline-none focus:outline-none`}
          onClick={() => {
            setIsNewPostModalOpen(true);
            openModal({
              modalType: "new-post",
              onCloseModal: () => setIsNewPostModalOpen(false),
            });
          }}
        >
          Start a post
        </button>
      </div>

      <PostModalActionButtons
        placement="create-post-card"
        onClickActionButton={() => {
          setIsNewPostModalOpen(true);
          openModal({
            modalType: "new-post",
            onCloseModal: () => setIsNewPostModalOpen(false),
          });
        }}
      />

      {isNewPostModalOpen && <PostModal modalTitle="Create Post" />}
    </div>
  );
};
