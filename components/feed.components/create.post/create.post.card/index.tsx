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
      className={`relative flex w-full flex-col gap-4 rounded-10px bg-background-shade-3 p-3 fsm:p-4`}
    >
      <div className={`top mb-2 flex w-full items-center gap-2`}>
        <Image
          src={user.profile_image.path}
          width={48}
          height={48}
          className={`!h-10 !w-10 rounded-full object-cover md:!h-12 md:!w-12`}
          alt={"icon"}
          sizes={"256px"}
        />
        <button
          className={`text-14px h-10 flex-grow rounded-10px border-2 border-gray-shade-3 bg-transparent px-6 text-left font-medium text-gray-shade-7 outline-none focus:outline-none md:h-12`}
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
