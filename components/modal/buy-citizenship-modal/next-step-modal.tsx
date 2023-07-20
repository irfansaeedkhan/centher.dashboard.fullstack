import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "../../button/final.button";

interface CustomModalProps {
  onClickClose: () => void;
}

export const CitizenShipNextStepModal: React.FC<CustomModalProps> = ({
  onClickClose,
}) => {
  const router = useRouter();

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
          You are almost done!
        </h2>
        <p className="text-14px font-medium text-gray-shade-14">
          Now you have to complete a couple more steps to set{" "}
          <span className="text-gradient"> CITIZEN Passport Membership. </span>{" "}
        </p>
      </div>
      <FinalButton
        onClick={() => {
          onClickClose();
          router.push({ pathname: AppRoutes.settings.citizenship });
        }}
        title="Continue"
        variant="primary"
        className="text-14px  w-full py-3 hover:text-black"
      />
    </div>
  );
};
