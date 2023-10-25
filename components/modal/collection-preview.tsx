import React from "react";
import Button from "@/components/button";

interface CustomModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  disable?: string;
  onSubmit?: () => void;
}

export const CollectionPreviewModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none">
      {/*content*/}
      <div
        className={`relative mx-3 flex w-full max-w-[1128px] flex-col rounded-2xl border border-gray-shade-3 bg-elevation-1 pt-6 focus:outline-none `}
      >
        {/*header*/}
        <div
          className={`relative flex h-10 items-center justify-between rounded-t px-4`}
        >
          <span
            className={`textGradient text-sm font-semibold text-white fmd:text-[18px] [@media(min-width:360px)]:text-[16px]`}
          >
            {props.title}
          </span>
          <div className="flex items-center gap-2">
            <Button
              title="Edit"
              variant="secondary"
              onClick={props.onClose}
              className={`text-xs font-medium text-white`}
              borderRounded="10px"
            />
            <Button
              title="Submit"
              variant="primary"
              onClick={props.onSubmit}
              className={`text-xs font-medium text-white`}
              borderRounded="10px"
            />
          </div>
        </div>
        <div className={`max-h-[600px] overflow-y-auto`}>{props.children}</div>
      </div>
    </div>
  );
};
