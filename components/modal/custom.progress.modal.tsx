import React from "react";
import ctl from "@netlify/classnames-template-literals";

import { NTRDAOIcon, SpinIcon2, SuccessIcon, WarningIcon } from "@/assets/svgs";

import Button from "../button";

interface CustomProgressModalProps {
  title: string;
  status: string;
  subTitle: string;
  description: string;
  buttonTitle: string;
  handleBuyNow: () => void;
  handleAutorize: () => void;
  handleClaim: () => void;
  onClose: () => void;
}

export const CustomProgressModal: React.FC<CustomProgressModalProps> = ({
  title,
  status = "warning",
  subTitle,
  description,
  buttonTitle,
  handleBuyNow,
  handleAutorize,
  handleClaim,
  onClose,
}) => {
  return (
    <div className={CustomProgressModalContainer}>
      {/*content*/}
      <div className={modalContent}>
        {/*header*/}
        <div className={modalHeader}>
          <span className={modalHeaderTitle}>{title}</span>
          <button className={modalHeaderButton} onClick={onClose}>
            ×
          </button>
        </div>
        {/* BodyWrapper */}
        <div className={bodyWrapper}>
          <div className={modalBodyWrapper}>
            <div className="flex items-center justify-center">
              {status === "progress" && <SpinIcon2 />}
              {status === "success" && <SuccessIcon />}
              {status === "warning" && <WarningIcon />}
              {status === "failed" && <WarningIcon />}
              {status === "ntrdao" && <NTRDAOIcon />}
              {status === "claim" && <NTRDAOIcon />}
            </div>
            <div className={Modalcontent}>
              <h5 className={modalTitle}>
                {status === "progress"
                  ? "Transaction in progress"
                  : status === "failed"
                  ? "Transaction failed"
                  : subTitle}
              </h5>
              <h6 className={modalMessage}>
                {status === "progress"
                  ? "Your transaction in progress. Please wait..."
                  : status === "failed"
                  ? "Your transaction failed. Please try again."
                  : description}
              </h6>
            </div>
            <div className={modalFooter}>
              <Button
                title={
                  status === "success" || status === "failed" ? "Ok" : "Cancel"
                }
                variant={status === "success" ? "v1" : "v2"}
                onClick={onClose}
                className="py-3"
              />
              {status !== "success" && status !== "failed" && (
                <Button
                  title={buttonTitle}
                  variant="v1"
                  onClick={
                    status === "ntrdao"
                      ? handleBuyNow
                      : status === "claim"
                      ? handleClaim
                      : handleAutorize
                  }
                  className="py-3"
                  disabled={status === "progress"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomProgressModalContainer = ctl(`
  flex 
  z-50 
  fixed 
  inset-0 
  items-center 
  outline-none 
  justify-center 
  backdrop-filter 
  overflow-y-auto 
  backdrop-blur-lg
  overflow-x-hidden 
  focus:outline-none 
`);

const modalContent = ctl(`
  flex 
  mx-3 
  pb-5 
  border 
  flex-col 
  relative 
  lg:w-164 
  md:w-140
  xl:w-164 
  sm:w-full 
  rounded-lg
  bg-black-shade-3
  focus:outline-none 
  border-gray-shade-3
`);

const modalHeader = ctl(`
  flex 
  py-6
  px-4
  rounded-t 
  items-center 
  justify-center
  relative
`);

const modalHeaderTitle = ctl(`text-white text-24px text-center font-semibold`);

const modalHeaderButton = ctl(`
  px-1 
  py-1 
  ml-auto 
  border-0 
  text-3xl 
  text-white 
  opacity-100 
  float-right 
  outline-none 
  leading-none 
  font-semibold 
  bg-transparent 
  focus:outline-none
  absolute
  top-[50%] translate-y-[-50%] 
  right-6
  hover:scale-110
  transition
`);

const bodyWrapper = ctl(`
  maxHeight-[400px] 
  overflow-y-scroll
`);

// modal styling
const modalBodyWrapper = ctl(`
  text-center flex flex-col gap-6 w-full border-t-2 border-gray-shade-3 pt-4
`);
const Modalcontent = ctl(`
px-6
`);
const Icon = ctl(`
mx-auto w-[64px]
`);
const modalTitle = ctl(`
text-18px text-white font-semibold pb-2
`);
const modalMessage = ctl(`
text-14px text-gray-shade-2 font-normal
`);
const modalFooter = ctl(`
flex items-center justify-center gap-3  pt-6 px-6
`);
