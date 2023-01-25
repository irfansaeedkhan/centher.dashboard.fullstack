import React, { useRef } from "react";
import { useEventListener } from "usehooks-ts";

import { ModalPortal } from "@/components/modal/modal.portal";

import PostModalFooter from "./post.modal.footer";
import PostModalHeader from "./post.modal.header";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClickClose: () => void;
}

export const PostModalContainer: React.FC<CustomModalProps> = ({
  children,
  title,
  isOpen,
  onClickClose,
}) => {
  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="post-modal-portal">
      {/* Background */}
      <div
        className={`font-monto flex justify-center items-center fixed inset-0 z-[1050] backdrop-filter backdrop-blur-lg overflow-y-auto overflow-x-hidden bg-black-shade-12 fsm:bg-transparent`}
      >
        {/* Container */}
        <div
          className={`flex flex-col w-full max-w-[656px] h-full fsm:h-auto fsm:max-h-[90%] fsm:mx-2 md:mx-0 fsm:rounded-2xl bg-black-shade-12 border border-gray-shade-3 border-opacity-40`}
        >
          {/* Header */}
          <PostModalHeader title={title} onClickClose={onClickClose} />

          {/* Children Wrapper */}
          <div className="overflow-auto scrollSet">{children}</div>

          <PostModalFooter />
        </div>
      </div>
    </ModalPortal>
  );
};
