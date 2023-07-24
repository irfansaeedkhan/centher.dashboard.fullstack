import React, { useEffect } from "react";
import clsx from "clsx";
import { ModalPortal } from "@/components/modal/modal.portal";
import { CircularClose } from "@/assets/svgs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  content: string;
  title: string;
}

export const ChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAction,
  content,
  title,
}) => {
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
            <h3 className="text-lg font-semibold">{title}</h3>
          </header>

          <main className="mt-6 fmd:mt-8">
            <div className="flex justify-center">
              <CircularClose />
            </div>

            <div className="mt-4 space-y-2 text-center fmd:mt-6">
              <h3 className="text-lg font-semibold text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-shade-2">{content}</p>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 fsm:flex-row fmd:mt-6">
              <ActionButton
                onClick={onClose}
                className="bg-black-shade-7 text-gray-shade-10 hover:bg-gray-900"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={onAction}
                className="group flex items-center justify-center bg-danger text-white hover:bg-red-900"
              >
                Delete
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
