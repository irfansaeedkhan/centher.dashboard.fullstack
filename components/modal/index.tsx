import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
interface ModalWrapperProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  bodyWrapper?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = (props) => {
  return props.isOpen ? (
    <div
      className={`fixed inset-0 z-[150] mx-3 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none 
    `}
    >
      {/* content */}
      <div
        className={`relative mx-3 flex w-full flex-col rounded-2xl bg-popup-0 p-4 focus:outline-none fmd:w-140 fmd:p-6 flg:w-164 f2xl:w-164`}
      >
        {/* header */}
        <div
          className={`relative mb-3 flex h-[28px] items-center justify-between rounded-t`}
        >
          <span
            className={`text-[16px] font-semibold text-white fmd:text-[18px]`}
          >
            {props.title}
          </span>
          <button
            className={`text-white`}
            onClick={props.onClose}
            type="button"
          >
            <IoClose />
          </button>
        </div>
        {/* BodyWrapper */}
        <div className={clsx("", props.bodyWrapper)}>{props.children}</div>
      </div>
    </div>
  ) : null;
};
