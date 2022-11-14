import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div className={CustomModalContainer}>
      {/*content*/}
      <div className={modalContent}>
        {/*header*/}
        <div className={modalHeader}>
          <span className={modalHeaderTitle}>{props.title}</span>
          <button className={modalHeaderButton} onClick={props.onClose}>
            ×
          </button>
        </div>
        {/* BodyWrapper */}
        <div className={bodyWrapper}>{props.children}</div>
      </div>
    </div>
  );
};

const CustomModalContainer = ctl(`
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

const modalContent = ctl(`
  flex 
  mx-3 
  pb-5 
  border 
  flex-col 
  relative 
  lg:w-164 
  md:w-140
  f2xl:w-164 
  sm:w-full 
  rounded-lg
  bg-black-shade-3
  focus:outline-none 
  border-gray-shade-3
`);

const modalHeader = ctl(`
  flex 
  py-6
  px-4
  rounded-t 
  items-center 
  justify-center
  relative
`);

const modalHeaderTitle = ctl(`text-white text-24px text-center font-semibold`);

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
  absolute
  top-[50%] translate-y-[-50%] 
  right-6
  hover:scale-110
  transition
`);

const bodyWrapper = ctl(`
  maxHeight-[400px] 
  overflow-y-scroll
`);
