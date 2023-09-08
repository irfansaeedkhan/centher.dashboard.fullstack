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
  const scrollref = useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    // scroll the component to the bottom
    setTimeout(() => {
      if (!scrollref.current) return;
      scrollref.current.scrollTop = scrollref.current.scrollHeight;
    }, 500);
  };

  return (
    <ModalPortal wrapperId="post-modal-portal">
      {/* Background */}
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-12 font-monto backdrop-blur-lg backdrop-filter fsm:bg-transparent`}
      >
        {/* Container */}
        <div
          className={`flex h-full w-full max-w-[656px] flex-col border border-gray-shade-3 border-opacity-40 bg-black-shade-12 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-2xl md:mx-0`}
        >
          {/* Header */}
          <PostModalHeader title={title} onClickClose={onClickClose} />

          {/* Children Wrapper */}
          <div className="scrollSet overflow-auto" ref={scrollref}>
            {children}
          </div>

          <PostModalFooter handleScroll={handleScroll} />
        </div>
      </div>
    </ModalPortal>
  );
};
