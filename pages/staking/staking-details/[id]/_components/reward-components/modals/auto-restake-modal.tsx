import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import Button from "@/components/button";
import ModalContainer from "@/components/modal/modal-container";
import { customLog } from "@/utils/custom.log";
import { LoaderSpinner } from "@/assets/svgs";

export interface AutoRestakeModalProps {
  modalName:
    | "enable-auto-restake"
    | "disable-auto-restake"
    | "auto-restake-enabled"
    | "auto-restake-disabled"
    | null;
  onClose: () => void;
  onClickActionButton: () => Promise<void>;
}

export const AutoRestakeModal: React.FC<AutoRestakeModalProps> = ({
  modalName,
  onClose,
  onClickActionButton,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  let heading = <></>;
  let description = <></>;
  let actionButtonText = "";

  if (modalName === "enable-auto-restake") {
    heading = <>Do you want to Enable Auto Restake?</>;
    description = (
      <>
        By enabling this feature your rewards will be automatically restaked as
        soon as they are available to claim.
      </>
    );
    actionButtonText = "Enable Auto Restake";
  } else if (modalName === "disable-auto-restake") {
    heading = <>Do you want to Disable Auto Restake?</>;
    description = (
      <>
        By disabling this feature your rewards will not be automatically
        restaked.
      </>
    );
    actionButtonText = "Disable Auto Restake";
  } else if (modalName === "auto-restake-enabled") {
    heading = <>Auto Restake Enabled Successfully</>;
    description = (
      <>
        You have successfully enabled auto restake. You will see the staking
        amount increasing at every auto restake.
      </>
    );
    actionButtonText = "Ok";
  } else if (modalName === "auto-restake-disabled") {
    heading = <>Auto Restake Disabled Successfully</>;
    description = (
      <>
        You have successfully disabled auto restake. In order to restake now,
        click on <strong className="font-semibold">Restake All</strong> or{" "}
        <strong className="font-semibold"> Restake</strong> button.
      </>
    );
    actionButtonText = "Ok";
  }

  return (
    <ModalContainer
      modalId="auto-restake-modal"
      isOpen={modalName !== null}
      onClose={onClose}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <header className="mb-4 flex items-center">
        <h1 className="flex-grow text-base font-semibold text-white">
          Auto Restake
        </h1>
        <IoClose
          className="size-6 cursor-pointer text-white"
          onClick={onClose}
        />
      </header>

      <div className="p-4 pb-0">
        <h3 className="text-center text-base font-semibold text-white">
          {heading}
        </h3>
        <p className="mt-2 text-center text-sm text-gray-shade-14">
          {description}
        </p>

        <div className="mt-4">
          <Button
            title={actionButtonText}
            className="w-full text-sm font-medium"
            onClick={() => {
              setIsSubmitting(true);
              onClickActionButton()
                .then(() => {
                  setIsSubmitting(false);
                })
                .catch((err: any) => {
                  toast.error(err.message);
                  setIsSubmitting(false);
                  customLog(["development", "staging", err]);
                });
            }}
            loaderIcon={
              isSubmitting && (
                <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
              )
            }
          />
        </div>
      </div>
    </ModalContainer>
  );
};
