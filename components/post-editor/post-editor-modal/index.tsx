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
  const { closeModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  if (!isClient || !isModalOpen) return null;

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
