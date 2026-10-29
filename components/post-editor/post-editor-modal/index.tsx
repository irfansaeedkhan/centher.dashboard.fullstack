import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useIsClient } from "usehooks-ts";
import { usePostEditorStore } from "@/store/post-editor-store";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { LoggedInUser } from "@/models/user";
import { ModalContainer } from "./modal-container";
import { EditorContainer } from "./editor-container";

interface Props {
  modalTitle: string;
  user: LoggedInUser;
}

export const PostEditorModal: React.FC<Props> = ({ modalTitle, user }) => {
  const isClient = useIsClient();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);

  const isModalOpen = usePostEditorStore(
    useShallow((state) => state.isModalOpen)
  );
  const modalType = usePostEditorStore(
    useShallow((state) => state.modalType)
  );
  const { closeModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  // Portfolio-library fix (2026-10-29): the feed and profile pages mount
  // TWO PostEditorModal instances — "Create Post" inside CreatePostCard
  // (always mounted) and "Reply" on the page — both reading the same
  // global isModalOpen flag. Opening a reply therefore rendered both
  // overlays stacked, with a Create Post heading inside the Reply view.
  // Each instance now renders only when its title matches the store's
  // current mode, so reply shows only Reply and create shows only
  // Create Post. (Only "new-post" and the reply modes have live openers;
  // "edit" has no opener on this store, verified by grep.)
  const isReplyMode =
    modalType === "reply" ||
    modalType === "reply-of-thread-post" ||
    modalType === "reply-of-reply";
  const matchesMode =
    modalTitle === "Create Post"
      ? modalType === "new-post"
      : modalTitle === "Reply"
        ? isReplyMode
        : true;

  if (!isClient || !isModalOpen || !matchesMode) return null;

  return (
    <>
      <ModalContainer title={modalTitle} user={user} onClickClose={closeModal}>
        <EditorContainer
          user={user}
          openBuyCitizenshipModal={() => setShowBuyCitizenshipModal(true)}
        />
      </ModalContainer>
      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </>
  );
};
