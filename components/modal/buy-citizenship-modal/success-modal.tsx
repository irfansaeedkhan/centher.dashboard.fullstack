import React from "react";
import Image from "next/image";

import FinalButton from "../../button/final.button";

interface CustomModalProps {
  onClickClose: () => void;
}

export const CitizenShipSuccessModal: React.FC<CustomModalProps> = ({
  onClickClose,
}) => {
  return (
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
          <span className="text-gradient">Centher Passport CITIZEN </span>{" "}
          Membership. Enjoy the best experience with us.
        </p>
      </div>
      <FinalButton
        onClick={onClickClose}
        title="Continue"
        variant="primary"
        className="text-14px  w-full py-3 hover:text-black"
      />
    </div>
  );
};
