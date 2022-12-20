import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

import { ModalPortal } from "@/components/modal/modal.portal";
import {
  DeleteCrossIcon,
  NTRDAOIconBG,
  SpinIcon2,
  SuccessIcon,
  WarningIcon,
} from "@/assets/svgs";

export type ModalStatus =
  | "success"
  | "progress"
  | "warning"
  | "error"
  | "buy-ntr";

export interface ModalProps {
  isOpen: boolean;
  status: ModalStatus;
  title: string;
  subtitle: string;
  bodyText: string;
  confirmButtonText: string;
  onClickClose: () => void;
  onClickConfirm: () => void;
}

export const LaunchpadModal: React.FC<ModalProps> = ({
  isOpen,
  status,
  title,
  subtitle,
  bodyText,
  confirmButtonText,
  onClickClose = () => {},
  onClickConfirm = () => {},
}) => {
  useEffect(() => {
    const body = document.querySelector("body")!;
    if (isOpen) {
      body.style.overflow = "hidden";
    }
    return () => {
      body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="authorize-modal">
      <div className="font-monto flex items-center justify-center fixed inset-0 z-[1000] backdrop-filter backdrop-blur-md overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-[656px] fsm:max-h-[90%] fsm:mx-2 md:mx-0 fsm:rounded-2xl bg-black-shade-12 text-white overflow-hidden">
          {/* Header */}
          <div className="flex justify-between p-4 border-b border-b-gray-shade-border-color">
            <h3 className="font-semibold">{title}</h3>
            <button
              onClick={status === "progress" ? () => {} : onClickClose}
              disabled={status === "progress"}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 text-center space-y-4">
            {status === "progress" && (
              <SpinIcon2 className="inline-block w-16 h-16" />
            )}
            {status === "success" && (
              <SuccessIcon className="inline-block w-16 h-16" />
            )}
            {status === "warning" && (
              <WarningIcon className="inline-block w-16 h-16" />
            )}
            {status === "error" && (
              <DeleteCrossIcon className="inline-block w-16 h-16" />
            )}
            {status === "buy-ntr" && (
              <NTRDAOIconBG className="inline-block w-16 h-16" />
            )}

            {!!subtitle && (
              <h4 className="text-center font-semibold">{subtitle}</h4>
            )}

            {!!bodyText && <p className="text-gray-shade-2">{bodyText}</p>}
          </div>

          {/* Action Buttons */}
          {status !== "success" && (
            <div className="flex mt-2 font-semibold">
              <button
                className="w-full p-4 text-center text-white bg-gray-shade-3"
                onClick={status === "progress" ? () => {} : onClickClose}
                disabled={status === "progress"}
              >
                Cancel
              </button>

              <button
                className="w-full p-4 text-center text-black bg-brand-primary"
                onClick={status === "progress" ? () => {} : onClickConfirm}
                disabled={status === "progress"}
              >
                {confirmButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
