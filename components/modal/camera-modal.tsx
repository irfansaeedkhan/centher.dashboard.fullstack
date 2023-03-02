import React from "react";

import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  disable?: string;
}

export const CameraCustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div
      className={`fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none 
    `}
    >
      {/*content*/}
      <div
        className={`relative mx-3 flex w-full flex-col rounded-2xl border border-gray-shade-3 bg-black-shade-3 pb-5 focus:outline-none fsm:w-[550px]`}
      >
        {/*header*/}
        <div
          className={`relative flex h-[64px] items-center justify-center rounded-t py-[14px] px-4`}
        >
          <span
            className={`text-[16px] font-semibold text-white fmd:text-[20px]`}
          >
            {props.title}
          </span>
          {props.disable === "yes" ? null : (
            <button
              className={`absolute top-[50%] right-4 translate-y-[-50%] bg-transparent font-semibold leading-none text-white opacity-100 outline-none focus:outline-none`}
              onClick={props.onClose}
            >
              <IoClose className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className={`max-h-full overflow-y-auto`}>{props.children}</div>
      </div>
    </div>
  );
};
