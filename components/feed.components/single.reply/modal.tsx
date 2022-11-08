import { DeleteCrossIcon } from "@/assets/svgs";
import { ModalWrapper } from "@/components/modal";
import React from "react";

interface ModalProps {
  deleteModal: boolean;
  onClose: () => void;
  deletePost: () => void;
}
const DeleteModal: React.FC<ModalProps> = (props) => {
  return (
    <ModalWrapper
      isOpen={props.deleteModal}
      onClose={props.onClose}
      title={"Delete Reply"}
    >
      <div className="lg:px-10 sm:px-5 flex flex-col lg:gap-6 sm:gap-3 pt-5 pb-8">
        <div className="flex justify-center">
          <DeleteCrossIcon />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h2 className="font-semibold lg:text-lg sm:text-lg text-center text-white">
            Are you sure?
          </h2>
          <h2 className="font-[400px] lg:text-lg sm:text-sm text-center text-[#ABAFC4]">
            Do you want to delete this post? This process cannot be undone.
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={props.onClose}
            className="mt-2 py-3 w-full font-bold rounded-lg items-center justify-center !bg-black-shade-7 hover:!bg-gray-900 transition-all text-[#666C8F]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              props.onClose;
              props.deletePost();
            }}
            className="mt-2 py-3 w-full font-bold rounded-lg items-center justify-center !bg-[#EA3943] hover:!bg-red-900  text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteModal;
