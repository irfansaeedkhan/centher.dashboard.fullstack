import React, { useRef, useState } from "react";
import clsx from "clsx";

import { useEventListener } from "usehooks-ts";
import { useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import Image from "next/image";
import FinalButton from "../button/final.button";

interface CustomModalProps {
  isOpen: boolean;
  onClickClose: () => void;
}

export const BuyPassportModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClickClose,
}) => {
  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);
  const PassportModalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"annually" | "monthly">("annually");
  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  useOnClickOutside(PassportModalRef, () => {
    onClickClose();
  });

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="buy-passport-portal">
      {/* Background */}
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        {/* Container */}
        <div
          className={`flex h-full w-full max-w-[422px] flex-col overflow-auto border border-solid  border-[#2a2d3c]   bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          {/* Header */}
          <div className={`flex items-start justify-between pb-6`}>
            <div className="flex flex-col">
              <h3
                className={`animationTextHeading flex-grow text-left text-base font-semibold text-white fsm:text-xl`}
              >
                Centher Passport
              </h3>
              <h5 className="text-sm font-medium text-gray-shade-14 fsm:text-base">
                Breaking the limit
              </h5>
            </div>
            {/* <button onClick={onClickClose}>
              <IoClose className="ioCLose h-5 w-5 fill-white" />
            </button> */}
          </div>
          <div className="mx-auto flex w-[90%] items-center justify-center gap-2">
            <button
              onClick={() => setTab("annually")}
              className={clsx(
                `primary-gradient-btn text-14px flex-2 relative flex items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[#17171A] p-[1px] ${
                  tab === "annually" ? "bg-gradient-pattern" : "bg-gray-shade-3"
                }`
              )}
            >
              <div className="default-button-styling flex h-full w-full flex-grow items-center gap-2 rounded-[10px] bg-[#0B0B0B] ">
                <span
                  className={clsx(
                    `relative ${
                      tab === "annually"
                        ? "primary-gradient-btn-text"
                        : "text-white"
                    }`
                  )}
                >
                  Annualy
                </span>
                <span className="rounded-full bg-background-shade-3 py-[2px] px-2">
                  <span className="primary-gradient-btn-text relative text-xs font-medium">
                    Save 12%
                  </span>
                </span>
              </div>
            </button>
            <button
              onClick={() => setTab("monthly")}
              className={clsx(
                `primary-gradient-btn text-14px relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[#17171A]  p-[1px] ${
                  tab === "monthly" ? "bg-gradient-pattern" : "bg-gray-shade-3"
                }`
              )}
            >
              <div className="default-button-styling flex h-full w-full flex-grow items-center justify-center gap-2 rounded-[10px] bg-[#0B0B0B] ">
                <span
                  className={clsx(
                    `relative ${
                      tab === "monthly"
                        ? "primary-gradient-btn-text"
                        : "text-white"
                    }`
                  )}
                >
                  Monthly
                </span>
              </div>
            </button>
          </div>
          <Image
            src={"/images/passport-banner.png"}
            alt={"passport-banner"}
            height={421}
            width={251}
            className="mt-5 w-full rounded-xl object-cover"
          />
          <div className="scrollSet mt-5 overflow-auto">
            <div className="content w-full">
              <div className="box rounded-xl border border-gray-shade-3 p-4">
                <ul className="text-14px flex flex-col gap-2 font-medium text-white">
                  <li className="list-item-with-image">
                    Giveaway as a service
                  </li>
                  <li className="list-item-with-image">
                    Launchpad as a service
                  </li>
                  <li className="list-item-with-image">Staking as a service</li>
                  <li className="list-item-with-image">Airdrop as a service</li>
                  <li className="list-item-with-image">Bulk messaging</li>
                  <li className="list-item-with-image">Create collections</li>
                  <li className="list-item-with-image">Group chat</li>
                  <li className="list-item-with-image">Advertising</li>
                  <li className="list-item-with-image text-gradient">
                    And much more
                  </li>
                </ul>
              </div>
              <FinalButton
                title={tab === "annually" ? "$1757 / year" : "$185 / month"}
                variant="primary"
                className="text-14px mt-5 w-full py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
