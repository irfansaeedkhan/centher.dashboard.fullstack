import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useEventListener } from "usehooks-ts";

import { ModalPortal } from "@/components/modal/modal.portal";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClickClose: () => void;
}

export const LockedNftModal: React.FC<CustomModalProps> = ({
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
    <ModalPortal wrapperId="lock-modal-portal">
      {/* Background */}
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-12 font-monto backdrop-blur-lg backdrop-filter fsm:bg-transparent`}
      >
        {/* Container */}
        <div
          className={`flex h-full w-full max-w-[656px] flex-col overflow-auto border border-gray-shade-3 border-opacity-40 bg-black-shade-12 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-2xl md:mx-0`}
        >
          {/* Header */}
          <div
            className={`flex items-center border-b-2 border-gray-shade-3 border-opacity-40 p-3`}
          >
            <h3
              className={`flex-grow text-left text-base font-semibold text-white fsm:text-xl`}
            >
              {title}
            </h3>

            <button onClick={onClickClose}>
              <IoClose className="ioCLose h-5 w-5 fill-white" />
            </button>
          </div>

          {/* Children Wrapper */}
          <div className="scrollSet overflow-auto bg-black-shade-12">
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
