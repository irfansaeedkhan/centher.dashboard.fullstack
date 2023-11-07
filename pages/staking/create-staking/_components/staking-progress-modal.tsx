import React, { useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import Button from "@/components/button";
import { MultiColorLoader } from "@/assets/svgs";
import { ProgressModal } from "../dto/progress-modal.dto";

interface CustomModalProps {
  onClickClose: () => void;
  data: ProgressModal[];
  item: ProgressModal;
}

export const StakingProgressModal: React.FC<CustomModalProps> = ({
  onClickClose,
  data,
  item,
}) => {
  const PassportModalRef = useRef<HTMLDivElement>(null);

  return (
    <ModalPortal wrapperId="progress-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[656px] flex-col overflow-auto border border-solid  border-[#2a2d3c] bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          <h2 className="pb-7 text-base font-semibold text-white f2xl:text-lg">
            Setting things for you
          </h2>
          <div className="flex flex-col gap-5 text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white fsm:text-lg">
                You are almost there!
              </h2>
              <p className="text-sm font-medium text-gray-shade-14">
                Please be patient, we are setting up things for you
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-shade-border-color bg-black-shade-9 p-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-white">{item.title}</h5>
                <div className="value">
                  <MultiColorLoader className="mx-auto w-16 animate-spin duration-[2000ms]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
