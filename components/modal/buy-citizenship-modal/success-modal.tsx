import React from "react";
import Image from "next/image";
import FinalButton from "../../button/final.button";
import { ModalPortal } from "../modal.portal";

interface CustomModalProps {}

export const CitizenShipSuccessModal: React.FC<CustomModalProps> = () => {
  return (
    <ModalPortal wrapperId="success-buy-passport-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[422px] flex-col overflow-auto border border-solid  border-[#2a2d3c]   bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
        >
          <div className="flex flex-col gap-8 text-center">
            <Image
              src={"/images/success-centher.png"}
              alt={"sucess image"}
              width={128}
              height={107}
              className="mx-auto"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white fsm:text-lg">
                You are all Set!
              </h2>
              <p className="text-14px font-medium text-gray-shade-14">
                Congratulations! you have successfully subscribed to{" "}
                <span className="text-gradient"> Centher CITIZEN Passport</span>{" "}
                Membership. Enjoy the best experience with us.
              </p>
            </div>
            <FinalButton
              onClick={() => {
                window.location.href = window.location.origin;
              }}
              title="Continue"
              variant="primary"
              className="text-14px w-full py-3 hover:text-black"
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
