import React from "react";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  disable?: string;
}

export const CustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none 
    `}
    >
      {/*content*/}
      <div
        className={`relative mx-3 flex w-full flex-col rounded-2xl bg-popup-0 p-4 focus:outline-none fmd:w-140 fmd:p-6 flg:w-164 f2xl:w-164`}
      >
        {/*header*/}
        <div
          className={`relative flex h-[28px] items-center justify-between rounded-t`}
        >
          <span
            className={`text-[16px] font-semibold text-white fmd:text-[18px]`}
          >
            {props.title}
          </span>
          {props.disable === "yes" ? null : (
            <button className={`text-white`} onClick={props.onClose}>
              <IoClose className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className={`max-h-[450px] overflow-y-auto`}>{props.children}</div>
      </div>
    </div>
  );
};
