import React, { useRef } from "react";
import { useEventListener } from "usehooks-ts";
import type { EmojiPlugin } from "@draft-js-plugins/emoji";
import { ModalPortal } from "@/components/modal/modal.portal";
import PostModalFooter from "./post.modal.footer";
import PostModalHeader from "./post.modal.header";

interface PostModalContainerProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClickClose: () => void;
  emojiPlugin: EmojiPlugin;
  EmojiSuggestions: React.ComponentType;
  EmojiSelect: React.ComponentType;
}

export const PostModalContainer: React.FC<PostModalContainerProps> = ({
  children,
  title,
  isOpen,
  onClickClose,
  emojiPlugin,
  EmojiSuggestions,
  EmojiSelect,
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
    <div>
      <ModalPortal wrapperId="post-modal-portal">
        {/* Background */}
        <div
          className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-12 font-monto backdrop-blur-lg backdrop-filter fsm:bg-transparent`}
        >
          {/* Container */}
          <div
            className={`flex h-full w-full max-w-[656px] flex-col border border-gray-shade-3 border-opacity-40 bg-black-shade-12 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-2xl md:mx-0`}
          >
            <div className="relative">
              {/* Header */}
              <PostModalHeader title={title} onClickClose={onClickClose} />

              {/* Children Wrapper */}
              <div
                className="scrollSet max-h-[60vh] overflow-auto"
                ref={scrollref}
              >
                {children}
              </div>

              <PostModalFooter
                handleScroll={handleScroll}
                emojiPlugin={emojiPlugin}
                EmojiSuggestions={EmojiSuggestions}
                EmojiSelect={EmojiSelect}
              />
            </div>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
};
