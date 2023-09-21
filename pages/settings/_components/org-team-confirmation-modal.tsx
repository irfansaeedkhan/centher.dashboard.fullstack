import React from "react";
import Image from "next/image";
import ModalContainer from "@/components/modal/modal-container";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modalId: string;
  modalTitle: string;
  images: string[];
  contentHeading: string;
  contentText: React.ReactNode;
  onClickConfirm: () => void;
}

export const OrgTeamConfirmationModal: React.FC<Props> = ({
  isOpen,
  modalId,
  onClose,
  modalTitle,
  images,
  contentHeading,
  contentText,
  onClickConfirm = () => {},
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      modalId={modalId}
      modalContentClassName="max-w-2xl p-6"
    >
      <h1 className="text-base font-semibold text-white">{modalTitle}</h1>

      <div className="mt-4 py-4 pb-0 fmd:p-4">
        {images.length && (
          <div className="flex justify-center">
            <div className="flex">
              <Image
                src={images[0]}
                alt="profile"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
              />

              {images.length > 1 && (
                <Image
                  src={images[1]}
                  alt="profile"
                  width={64}
                  height={64}
                  className="-ml-8 h-16 w-16 rounded-full"
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-center text-base font-semibold text-white">
            {contentHeading}
          </h3>

          <div className="word-break mt-2 text-center text-sm text-gray-shade-2">
            {contentText}
          </div>
        </div>

        <div className="mt-6 flex gap-x-2">
          <button
            className="w-full rounded-10px border border-gray-shade-3 py-2.5 text-sm font-medium text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full rounded-10px border border-red-shade-1 py-2.5 text-sm font-medium text-red-shade-1"
            onClick={onClickConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
