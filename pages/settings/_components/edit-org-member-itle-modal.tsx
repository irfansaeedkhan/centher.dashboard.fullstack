import React from "react";
import { IoClose } from "react-icons/io5";
import ModalContainer from "@/components/modal/modal-container";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClickConfirm: () => void;
  modalTitle: string;
  modalId: string;
  currentTitle: string;
  newTitle: string;
  setNewTitle: (title: string) => void;
  isTitleEditModalOpen: boolean;
}

export const EditOrgMemberTitleModal: React.FC<Props> = ({
  onClose,
  onClickConfirm,
  modalTitle,
  modalId,
  currentTitle,
  newTitle,
  setNewTitle,
  isTitleEditModalOpen,
}) => {
  return (
    <ModalContainer
      modalId={modalId}
      isOpen={isTitleEditModalOpen}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex items-center">
        <h3 className="flex-grow text-base font-semibold text-white">
          {modalTitle}
        </h3>
        <IoClose
          className="h-5 w-5 cursor-pointer text-white"
          onClick={onClose}
        />
      </div>

      <div className="mt-6 py-4 pb-0 fmd:p-4">
        <div className="relative space-y-1.5">
          <label
            htmlFor="current_title"
            className="text-sm font-normal text-white"
          >
            Current Title
          </label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              name="current_title"
              id="current_title"
              className="w-full rounded-lg border-none bg-black-shade-3 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-0"
              value={currentTitle}
              readOnly
            />
          </div>
        </div>
        <div className="mt-5 space-y-1.5">
          <label htmlFor="new_title" className="text-sm font-normal text-white">
            Enter New Title
          </label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              name="new_title"
              id="new_title"
              className="w-full rounded-lg border-none bg-black-shade-3 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-0"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-x-5">
          <button
            className="w-full rounded-xl border border-gray-shade-3 p-2.5 text-sm font-medium text-white hover:bg-black-shade-2"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="w-full rounded-xl border border-gray-shade-3 p-2.5 text-sm font-medium text-white hover:bg-black-shade-2"
            onClick={onClickConfirm}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
