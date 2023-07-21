import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { AppRoutes } from "@/constants/app.routes";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import FinalButton from "@/components/button/final.button";
import { IconFailure } from "@/assets/svgs";

interface CustomModalProps {
  onClickClose: () => void;
  retryFunc: () => void;
}

export const StakingFailureModal: React.FC<CustomModalProps> = ({
  onClickClose,
  retryFunc,
}) => {
  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);
  const PassportModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <ModalPortal wrapperId="failure-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[656px] flex-col overflow-auto border border-solid  border-[#2a2d3c] bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          <div className="flex flex-col gap-8  text-center">
            <IconFailure className="mx-auto" />
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white fsm:text-lg">
                Couldn&apos;t Create Staking
              </h2>
              <p className="text-14px font-medium text-gray-shade-14">
                Sorry, we couldn&apos;t Create your{" "}
                <span className="text-white">Staking</span> right now, Please
                make sure that you&apos;re connected to the Internet.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <FinalButton
                onClick={onClickClose}
                title="Cancel"
                variant="secondary"
                className="text-14px w-full rounded-[14px] py-3 hover:text-black"
              />
              <FinalButton
                onClick={retryFunc}
                title="Retry"
                variant="primary"
                className="text-14px w-full py-3 hover:text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
