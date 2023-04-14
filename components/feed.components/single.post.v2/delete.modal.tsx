import React, { useEffect } from "react";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

import { ModalPortal } from "@/components/modal/modal.portal";
import { CircularClose } from "@/assets/svgs";

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
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto backdrop-blur-lg backdrop-filter`}
      >
        <div className="mx-2 w-full max-w-[656px] rounded-2xl bg-popup-0 p-4 fmd:p-6">
          <header className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Delete Post</h3>
          </header>

          <main className="mt-6 fmd:mt-8">
            <div className="flex justify-center">
              <CircularClose />
            </div>

            <div className="mt-4 space-y-2 text-center fmd:mt-6">
              <h3 className="text-lg font-semibold text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-shade-2">
                Do you want to delete this post? This process cannot be undone.
              </p>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 fsm:flex-row fmd:mt-6">
              <ActionButton
                onClick={onClose}
                className="bg-black-shade-7 text-gray-shade-10 hover:bg-gray-900"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={async (e) => {
                  const button = e.currentTarget as HTMLButtonElement;
                  if (button.disabled) return;

                  button.disabled = true;
                  await onDelete();
                  // Set overflow to auto here to reset the body overflow on post delete
                  document.body.style.overflow = "auto";
                  button.disabled = false;
                  onClose();
                }}
                className="group flex items-center justify-center bg-danger text-white hover:bg-red-900"
              >
                <CgSpinner className="hidden h-5 w-5 animate-spin group-disabled:block" />
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
        `w-full rounded-lg px-4 py-2 font-semibold transition-all fmd:py-3`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
