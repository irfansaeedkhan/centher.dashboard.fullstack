import React, { useRef } from "react";
import { useRouter } from "next/router";
import { AppRoutes } from "@/constants/app.routes";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import Button from "@/components/button";
import { SuccessIcon } from "@/assets/svgs";

interface CustomModalProps {
  onClickClose: () => void;
}

export const StakingSuccessModal: React.FC<CustomModalProps> = ({
  onClickClose,
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
    <ModalPortal wrapperId="success-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[656px] flex-col overflow-auto border border-solid  border-[#2a2d3c] bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          <div className="flex flex-col gap-8 text-center">
            <SuccessIcon className="mx-auto w-16" />
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white fsm:text-lg">
                Staking Pack Created Successfully
              </h2>
              <p className="text-sm font-medium text-gray-shade-14">
                Congratulations! you have successfully created your{" "}
                <span className="text-white">Staking Pack</span> on{" "}
                {process.env.NEXT_PUBLIC_BRAND_NAME}
                platform click on view Staking to view your Pack
              </p>
            </div>
            <Button
              onClick={() => {
                router.push({
                  pathname: AppRoutes.staking.index,
                });
              }}
              title="View Staking pack"
              variant="primary"
              className="w-full   py-3 text-sm hover:text-black"
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
