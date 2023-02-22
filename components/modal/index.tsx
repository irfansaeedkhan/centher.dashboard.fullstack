import React from "react";
import ctl from "@netlify/classnames-template-literals";
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
    <div className={modalWrapper}>
      <div className={clsx("relative p-4")}>
        {/* content */}
        <div className={modalContent}>
          {/* header */}
          <div className={modalHeader}>
            <span className={modalHeaderTitle}>{props.title}</span>
            <button
              className={modalHeaderButton}
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
  rounded-2xl
`);

const modalContent = ctl(`
  flex 
  pb-5 
  border
  p-4  
  flex-col 
  relative 
  lg:w-164 
  md:w-140
  f2xl:w-164 
  'bg-black-shade-3'
  focus:outline-none 
  border-gray-shade-3
  bg-black-shade-12
  rounded-2xl
`);

const modalHeader = ctl(`
  flex
  pb-3
  rounded-t 
  items-center 
  justify-between 
`);

const modalHeaderTitle = ctl(
  `text-white fsm:text-2xl py-1 flex-grow text-center text-base font-semibold `
);

const modalHeaderButton = ctl(`
  px-1 
  py-1 
  ml-auto 
  border-0 
  text-2xl 
  text-white 
  opacity-100 
  float-right 
  outline-none 
  leading-none 
  font-semibold 
  bg-transparent 
  focus:outline-none
`);
