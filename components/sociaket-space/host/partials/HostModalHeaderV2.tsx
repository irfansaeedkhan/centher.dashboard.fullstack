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
  hasBackButton = true,
}) => {
  return (
    <div className="border-b border-[#1F1F1F] p-[24px]">
      <div className="align-start flex justify-between">
        <div className="flex w-[100%] justify-between gap-[4px]">
          <div className="flex items-center justify-between ">
            {hasBackButton && (
              <button onClick={() => onBack()}>
                <BackButtonShiny />
              </button>
            )}
          </div>

          <span className="text-[20px] font-semibold leading-[36px] text-white">
            {title}
          </span>

          <span className="h-[36px] w-[36px]">&nbsp;</span>
        </div>
      </div>
    </div>
  );
};

export default HostModalHeader;
