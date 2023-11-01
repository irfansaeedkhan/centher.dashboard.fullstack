import React from "react";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  disable?: string;
}

export const CustomNewModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none 
    `}
    >
      {/*content*/}
      <div
        className={`relative mx-3 flex w-full flex-col rounded-3xl border border-gray-shade-3 bg-black-shade-3 py-6 focus:outline-none fmd:w-140 flg:w-164 f2xl:w-164`}
      >
        {/*header*/}
        <div
          className={`relative flex h-[28px] items-center justify-center rounded-t px-4`}
        >
          <span
            className={`word-break text-[16px] font-semibold text-white fmd:text-[18px]`}
          >
            {props.title}
          </span>
          {props.disable === "yes" ? null : (
            <button
              className={`absolute right-4 top-[50%] translate-y-[-50%] text-white`}
              onClick={props.onClose}
            >
              <IoClose className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className={`customScrollbar max-h-[600px] overflow-y-auto`}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
