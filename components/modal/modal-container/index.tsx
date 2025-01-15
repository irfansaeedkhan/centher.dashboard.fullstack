import React, { useEffect, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import cn from "@/utils/cn";
import { ModalPortal } from "../modal.portal";

interface Props {
  children?: React.ReactNode;
  modalId: string;

  isOpen: boolean;
  onClose: () => void;

  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEsc?: boolean;

  modalClassName?: string;
  modalContentClassName?: string;
}

const ModalContainer: React.FC<Props> = ({
  modalId,
  isOpen,
  onClose,
  children,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
  modalClassName,
  modalContentClassName,
}) => {
  const htmlBodyRef = useRef<HTMLBodyElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    htmlBodyRef.current = document.body as HTMLBodyElement;
  }, []);

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && shouldCloseOnEsc) {
        if (htmlBodyRef.current) {
          htmlBodyRef.current.style.overflow = "auto";
        }
        onClose();
      }
    },
    htmlBodyRef
  );

  useEffect(() => {
    if (!htmlBodyRef.current) return;
    if (isOpen) {
      htmlBodyRef.current.style.overflow = "hidden";
    } else {
      htmlBodyRef.current.style.overflow = "auto";
    }
  }, [isOpen, onClose]);

  useOnClickOutside(modalContentRef, () => {
    if (!shouldCloseOnOverlayClick) return;
    if (htmlBodyRef.current) {
      htmlBodyRef.current.style.overflow = "auto";
    }

    onClose();
  });

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId={modalId}>
      <div
        className={cn(
          `fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto outline-none backdrop-blur-lg backdrop-filter focus:outline-none`,
          modalClassName
        )}
      >
        <div
          ref={modalContentRef}
          className={cn(
            `relative mx-2 max-w-xl flex-grow rounded-10px bg-popup-0 p-6`,
            modalContentClassName
          )}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default ModalContainer;
