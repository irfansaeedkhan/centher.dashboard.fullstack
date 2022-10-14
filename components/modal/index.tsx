import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = (props) => {
  return (
    <div className={modalWrapper}>
      <div className={modalWrapperChild1}>
        {/*content*/}
        <div className={modalContent}>
          {/*header*/}
          <div className={modalHeader}>
            <span className={modalHeaderTitle}>{props.title}</span>
            <button
              className={modalHeaderButton}
              onClick={props.onClose}
              type="button"
            >
              ×
            </button>
          </div>
          {/* BodyWrapper */}
          <div className={bodyWrapper}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

const modalWrapper = ctl(`
  flex 
  z-50 
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

const modalWrapperChild1 = ctl(`
  p-12
  xl:p-4 
  lg:p-4 
  md:p-4 
  sm:p-12 
  relative 
`);

const modalContent = ctl(`
  flex 
  mx-3 
  pb-5 
  border
  lg:p-4 
  xl:p-4 
  md:p-4 
  sm:p-4  
  flex-col 
  relative 
  lg:w-164 
  md:w-140
  xl:w-164 
  sm:w-full 
  rounded-lg
  bg-black-shade-3
  focus:outline-none 
  border-gray-shade-3
`);

const modalHeader = ctl(`
  flex 
  pb-3
  rounded-t 
  items-center 
  justify-between 
`);

const modalHeaderTitle = ctl(`animationTextHeading py-1`);

const modalHeaderButton = ctl(`
  px-1 
  py-1 
  ml-auto 
  border-0 
  text-3xl 
  text-white 
  opacity-100 
  float-right 
  outline-none 
  leading-none 
  font-semibold 
  bg-transparent 
  focus:outline-none
`);

const bodyWrapper = ctl(`
  scrollSet
  maxHeight-[400px] 
  overflow-y-scroll
`);
