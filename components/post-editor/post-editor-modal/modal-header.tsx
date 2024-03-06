import React from "react";
import { useShallow } from "zustand/react/shallow";
import { IoClose } from "react-icons/io5";
import { usePostEditorStore } from "@/store/post-editor-store";

interface Props {
  title: string;
  onClickClose: () => void;
}

export const ModalHeader: React.FC<Props> = ({ title, onClickClose }) => {
  const isSubmitting = usePostEditorStore(
    useShallow((state) => state.isSubmitting)
  );

  return (
    <div
      className={`flex items-center border-b-2 border-gray-shade-3 border-opacity-40 p-3`}
    >
      <h3
        className={`flex-grow text-center text-base font-semibold text-white fsm:text-xl`}
      >
        {title}
      </h3>

      {!isSubmitting && (
        <button onClick={onClickClose}>
          <IoClose className="h-5 w-5 fill-white" />
        </button>
      )}
    </div>
  );
};
