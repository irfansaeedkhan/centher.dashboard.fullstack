import React, { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { ModalPortal } from "@/components/modal/modal.portal";
import { usePostEditorStore } from "@/store/post-editor-store";
import { LoggedInUser } from "@/models/user";
import { ModalHeader } from "./modal-header";
import { ModalFooter } from "./modal-footer";

interface PostModalContainerProps {
  user: LoggedInUser;
  title: string;
  children?: React.ReactNode;
  onClickClose: () => void;
}

export const ModalContainer: React.FC<PostModalContainerProps> = ({
  user,
  children,
  title,
  onClickClose,
}) => {
  const scrollref = useRef<HTMLDivElement>(null);
  const { getLastPost, getLastActivePost } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  const handleScroll = () => {
    if (getLastActivePost()?.uuid !== getLastPost()?.uuid) {
      setTimeout(() => {
        if (!scrollref.current) return;
        scrollref.current.scrollTop += 112; // 112px is the height of the text editor container (96px) + 16px gap
      }, 500);
      return;
    }
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Container */}
        <div
          className={`flex h-full w-full max-w-[656px] flex-col border border-gray-shade-3 border-opacity-40 bg-black-shade-12 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-2xl fmd:mx-0`}
        >
          <div className="relative">
            {/* Header */}
            <ModalHeader title={title} onClickClose={onClickClose} />

            {/* Children Wrapper */}
            <div
              className="scrollSet max-h-[60vh] overflow-auto"
              ref={scrollref}
            >
              {children}
            </div>

            <ModalFooter handleScroll={handleScroll} user={user} />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
