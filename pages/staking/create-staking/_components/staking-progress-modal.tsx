import React, { useRef } from "react";
import { useRouter } from "next/router";

import { AppRoutes } from "@/constants/app.routes";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import FinalButton from "@/components/button/final.button";
import { MultiColorLoader, SuccessIcon } from "@/assets/svgs";
import { BiCheckCircle } from "react-icons/bi";
import { clsx } from "clsx";
import { ProgressModal } from "../dto/progress-modal.dto";
import { ProgressStatus } from "@/staking/enum/create-pool-steps.enum";

interface CustomModalProps {
  onClickClose: () => void;
  data: ProgressModal[];
}

export const StakingProgressModal: React.FC<CustomModalProps> = ({
  onClickClose,
  data,
}) => {
  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);
  const PassportModalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(PassportModalRef, () => {
    onClickClose();
  });

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  return (
    <ModalPortal wrapperId="progress-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[656px] flex-col overflow-auto border border-solid  border-[#2a2d3c] bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          <h2 className="text-18px pb-7 font-semibold text-white">
            Setting things for you
          </h2>
          <div className="flex flex-col gap-5 text-center">
            <MultiColorLoader className="spinner-2s mx-auto w-16" />
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white fsm:text-lg">
                You are almost there!
              </h2>
              <p className="text-14px font-medium text-gray-shade-14">
                Please be patient, we are setting up things for you
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-shade-border-color bg-black-shade-9 p-4">
              {data.map((e, i) => {
                if (e.status == ProgressStatus.pending) {
                  return (
                    <div className="flex items-center justify-between" key={i}>
                      <h5 className="text-14px font-medium text-white">
                        {e.title}
                      </h5>
                      <div className="value">
                        <h6 className="text-14px font-medium text-[#F3BA2F]">
                          Pending
                        </h6>
                      </div>
                    </div>
                  );
                }
                if (e.status == ProgressStatus.inProgress) {
                  return (
                    <div className="flex items-center justify-between" key={i}>
                      <h5 className="text-14px font-medium text-white">
                        {e.title}
                      </h5>
                      <div className="value w-40">
                        <div
                          className={clsx(
                            "relative mt-2 h-3 w-full overflow-hidden rounded-3xl bg-[#76E268]/[0.16]"
                          )}
                        >
                          <div
                            style={{
                              width: `${e.value}%`,
                              transition: "2s",
                            }}
                            className={clsx(
                              `absolute top-0 z-50 h-3 rounded-3xl bg-[#76E268]`
                            )}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (e.status == ProgressStatus.done) {
                  return (
                    <div className="flex items-center justify-between" key={i}>
                      <h5 className="text-14px font-medium text-white">
                        {e.title}
                      </h5>
                      <div className="value">
                        <BiCheckCircle className="h-6 w-6 flex-shrink-0 fill-[#76E268]" />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <FinalButton
              onClick={() => {
                onClickClose();
              }}
              title="Hide"
              variant="secondary"
              className="text-14px w-full rounded-[14px] py-3 hover:text-white"
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
