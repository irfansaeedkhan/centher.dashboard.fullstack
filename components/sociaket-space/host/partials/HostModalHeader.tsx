import React from "react";
import { BackButtonShiny } from "@/assets/svgs";

interface HostModalProps {
  children?: React.ReactNode;
  onClose: () => void;
  onBack: () => void;
  title: string;
  subTitle: string;
  hasBackButton?: Boolean;
}

const HostModalHeader: React.FC<HostModalProps> = ({
  children,
  onClose,
  onBack,
  title,
  subTitle,
  hasBackButton = false,
}) => {
  return (
    <div className="align-start flex justify-between">
      <div className="flex w-[100%] flex-col gap-[4px]">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-[12px]">
            {hasBackButton && (
              <button onClick={() => onBack()}>
                <BackButtonShiny />
              </button>
            )}

            <span className="text-[14px] font-semibold text-[#B7BBCC]">
              {subTitle}
            </span>
          </div>

          {children}
        </div>

        <span className="text-gradient-1 font-gravesend text-[24px] font-bold">
          {title}
        </span>
      </div>
    </div>
  );
};

export default HostModalHeader;
