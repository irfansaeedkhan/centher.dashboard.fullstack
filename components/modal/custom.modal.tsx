import React from "react";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div
      className={`
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
`}
    >
      {/*content*/}
      <div
        className={`
  flex 
  mx-3 
  pb-5 
  border 
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
`}
      >
        {/*header*/}
        <div
          className={`
  flex 
  py-6
  px-4
  rounded-t 
  items-center 
  justify-center
  relative
`}
        >
          <span className={`text-white text-24px text-center font-semibold`}>
            {props.title}
          </span>
          <button
            className={`
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
`}
            onClick={props.onClose}
          >
            ×
          </button>
        </div>
        {/* BodyWrapper */}
        <div
          className={`
  maxHeight-[400px] 
  overflow-y-scroll
`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
