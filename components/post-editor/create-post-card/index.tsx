import React from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { usePostEditorStore } from "@/store/post-editor-store";
import { LoggedInUser } from "@/models/user";
import { PostEditorModal } from "../post-editor-modal";
import { ActionButtons } from "../shared/ui/action-buttons";

interface Props {
  user: LoggedInUser;
}

export const CreatePostCard: React.FC<Props> = ({ user }) => {
  const { openModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  return (
    <div
      className={`relative w-full space-y-4 rounded-10px bg-background-shade-3 p-3 fsm:p-4`}
    >
      <div className={`flex w-full items-center gap-2`}>
        <Image
          src={user.profile_image}
          width={256}
          height={256}
          className={`size-10 shrink-0 rounded-full object-cover fmd:size-12`}
          alt={user.display_name}
        />
        <button
          className={`h-10 flex-grow rounded-10px border-2 border-gray-shade-3 bg-transparent px-6 text-left text-sm font-medium text-gray-shade-7 outline-none focus:outline-none fmd:h-12`}
          onClick={() => {
            openModal({
              modalType: "new-post",
              shouldAddNewPost: true,
            });
          }}
        >
          Start a post
        </button>
      </div>

      <ActionButtons
        placement="create-post-card"
        onClickActionButton={() => {
          openModal({
            modalType: "new-post",
            shouldAddNewPost: false,
          });
        }}
      />

      <PostEditorModal modalTitle="Create Post" user={user} />
    </div>
  );
};
