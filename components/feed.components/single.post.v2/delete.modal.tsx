import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

import { ModalPortal } from "@/components/modal/modal.portal";
import { CircularClose } from "@/assets/svgs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  /**
   * Post-grill Q21: the modal used to say "Delete Post" even when the
   * target was a reply. Label it by what's actually being deleted.
   */
  itemLabel?: "Post" | "Reply";
}

export const DeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDelete,
  itemLabel = "Post",
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // Q21: Escape dismisses (the standing rule: every modal escapable at
  // every step) — except mid-delete, when dismissal is disabled so the
  // flight can't be abandoned half-reported.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete();
      // Set overflow to auto here to reset the body overflow on delete
      document.body.style.overflow = "auto";
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalPortal wrapperId="post-delete-modal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto backdrop-blur-lg backdrop-filter`}
        onClick={() => {
          // Q21: backdrop click dismisses (disabled mid-delete).
          if (!isDeleting) onClose();
        }}
      >
        <div
          className="mx-2 w-full max-w-[656px] rounded-2xl bg-popup-0 p-4 fmd:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Delete {itemLabel}</h3>
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
                {/* Q21: copy matches the tombstone reality — the item
                    is replaced by a "deleted" placeholder so the thread
                    survives; it is not silently hard-wiped. */}
                Do you want to delete this {itemLabel.toLowerCase()}? It will be
                replaced with a “deleted” placeholder wherever it appears. This
                cannot be undone.
              </p>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 fsm:flex-row fmd:mt-6">
              <ActionButton
                onClick={onClose}
                disabled={isDeleting}
                className="bg-black-shade-7 text-gray-shade-10 hover:bg-gray-900 disabled:opacity-50"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center bg-danger text-white hover:bg-red-900 disabled:opacity-70"
              >
                {isDeleting ? (
                  <CgSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </ActionButton>
            </div>
          </main>
        </div>
      </div>
    </ModalPortal>
  );
};

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

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
