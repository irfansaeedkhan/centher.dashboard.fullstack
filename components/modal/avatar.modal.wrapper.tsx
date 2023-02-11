import React from "react";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";
import { CloseSmallIcon } from "@/assets/svgs";
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
    <div className={modalWrapper}>
      <div className={clsx("relative p-4")}>
        {/* content */}
        <div className={modalContent}>
          {/* header */}
          <div
            className={`mb-8 flex items-center justify-between rounded-t border-b border-white/[4%] p-4`}
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
          <div className={clsx("", props.bodyWrapper)}>{props.children}</div>
        </div>
      </div>
    </div>
  ) : null;
};

const modalWrapper = ctl(`
  flex 
  z-[200]
  fixed 
  inset-0 
  items-center 
  outline-none 
  justify-center 
  backdrop-filter 
  overflow-y-auto 
  backdrop-blur-lg
  overflow-x-hidden 
  focus:outline-none 
`);

const modalContent = ctl(`
  flex 
  pb-5 
  border  
  flex-col 
  relative 
  lg:w-164 
  md:w-140
  f2xl:w-164 
  rounded-lg
  bg-popup-0
  focus:outline-none 
  border-gray-shade-3
`);
