import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

interface AvatarModalWrapperProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  bodyWrapper?: string;
}

export const AvatarModalWrapper: React.FC<AvatarModalWrapperProps> = (
  props
) => {
  return props.isOpen ? (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none`}
    >
      <div className={clsx("relative p-4")}>
        {/* content */}
        <div
          className={`relative flex w-full flex-col rounded-2xl bg-popup-0 pb-4 focus:outline-none md:w-[656px] md:pb-6`}
        >
          {/* header */}
          <div
            className={`mb-0 flex items-center justify-between rounded-t p-4 md:p-6`}
          >
            <span className={`py-1 text-lg font-semibold text-white`}>
              {props.title}
            </span>
            {/* <button type="button"> */}
            <span
              className={`cursor-pointer text-2xl text-white`}
              onClick={props.onClose}
            >
              <IoClose />
            </span>
            {/* </button> */}
          </div>
          {/* BodyWrapper */}
          <div className={clsx(props.bodyWrapper)}>{props.children}</div>
        </div>
      </div>
    </div>
  ) : null;
};
