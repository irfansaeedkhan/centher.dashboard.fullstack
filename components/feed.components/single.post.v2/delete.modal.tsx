import React, { useEffect } from "react";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { IoClose, IoCloseCircleOutline } from "react-icons/io5";

import { ModalPortal } from "@/components/modal/modal.portal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ isOpen, onClose, onDelete }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="post-delete-modal">
      <div
        className={`font-monto flex justify-center items-center fixed inset-0 z-[1050] backdrop-filter backdrop-blur-lg overflow-y-auto overflow-x-hidden`}
      >
        <div className="bg-popup-0 w-full max-w-[656px] rounded-10px p-4 fmd:p-6 space-y-4 fmd:space-y-6 mx-2">
          <header className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Delete Post</h3>
            <button onClick={onClose}>
              <IoClose className="w-6 h-6 cursor-pointer" />
            </button>
          </header>

          <main className="py-2 fmd:p-4">
            <div className="flex justify-center">
              <IoCloseCircleOutline className="w-12 h-12 fmd:w-16 fmd:h-16 stroke-danger" />
            </div>

            <div className="space-y-2 text-center mt-4">
              <h3 className="font-semibold text-lg text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-shade-2">
                Do you want to delete this post? This process cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 mt-6">
              <ActionButton
                onClick={onClose}
                className="bg-black-shade-7 hover:bg-gray-900 text-gray-shade-10"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={async (e) => {
                  const button = e.target as HTMLButtonElement;
                  button.disabled = true;
                  await onDelete();
                  button.disabled = false;
                  onClose();
                }}
                className="bg-danger hover:bg-red-900 text-white flex items-center justify-center group"
              >
                <CgSpinner className="w-5 h-5 animate-spin hidden group-disabled:block" />
                <span className="group-disabled:hidden">Delete</span>
              </ActionButton>
            </div>
          </main>
        </div>
      </div>
    </ModalPortal>
  );
};

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        `px-4 py-2 fmd:py-3 w-full font-bold rounded-lg transition-all`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
