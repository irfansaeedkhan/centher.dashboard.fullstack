import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

import { ModalPortal } from "./modal.portal";
import {
  DeleteCrossIcon,
  LoaderIcon,
  SuccessIcon,
  WarningGradient,
  BUSDIconBG,
  NTRIconBG,
  DXCIconBG,
} from "@/assets/svgs";
import Button from "../button";

export interface ModalState {
  isOpen: boolean;
  status: ModalProps["status"];
  title: ModalProps["title"];
  subtitle: ModalProps["subtitle"];
  bodyText: ModalProps["bodyText"];
  confirmButtonText: ModalProps["confirmButtonText"];
  onClose: ModalProps["onClickClose"];
  onClickConfirm: ModalProps["onClickConfirm"];
}
export interface IModalProps {
  txStatus: boolean;
  msg: string;
}
export type ModalStatus =
  | "success"
  | "progress"
  | "warning"
  | "error"
  | "buy-cthr"
  | "claim-busd"
  | "claim-ntr";

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

export const StandardModal: React.FC<ModalProps> = ({
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
      <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto backdrop-blur-md backdrop-filter">
        <div className="w-full max-w-[656px] overflow-hidden bg-black-shade-12 p-4 text-white fsm:mx-2 fsm:max-h-[90%] fsm:rounded-2xl md:mx-0">
          {/* Header */}
          <div className="flex justify-between">
            <h3 className="font-semibold">{title}</h3>
            <button
              onClick={status === "progress" ? () => {} : onClickClose}
              disabled={status === "progress"}
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 p-4 text-center">
            {status === "progress" && (
              <LoaderIcon className="inline-block h-16 w-16 animate-spin" />
            )}
            {status === "success" && (
              <SuccessIcon className="inline-block h-16 w-16" />
            )}
            {status === "warning" && (
              <WarningGradient className="inline-block h-16 w-16" />
            )}
            {status === "error" && (
              <DeleteCrossIcon className="inline-block h-16 w-16" />
            )}
            {status === "buy-cthr" && (
              <DXCIconBG className="inline-block h-16 w-16" />
            )}

            {status === "claim-busd" && (
              <BUSDIconBG className="inline-block h-16 w-16" />
            )}

            {status === "claim-ntr" && (
              <NTRIconBG className="inline-block h-16 w-16" />
            )}

            {!!subtitle && (
              <h4 className="text-center font-semibold">{subtitle}</h4>
            )}

            {!!bodyText && <p className="text-gray-shade-2">{bodyText}</p>}
          </div>

          {/* Action Buttons */}
          {status !== "success" && (
            <div className="mt-2 flex gap-2 font-semibold">
              <Button
                variant="secondary"
                title="Cancel"
                className="w-full"
                onClick={status === "progress" ? () => {} : onClickClose}
                disabled={status === "progress"}
              />
              <Button
                variant="primary"
                title={confirmButtonText}
                className="w-full"
                onClick={status === "progress" ? () => {} : onClickConfirm}
                disabled={status === "progress"}
              />
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
