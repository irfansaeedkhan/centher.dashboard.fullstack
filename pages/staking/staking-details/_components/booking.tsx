import React from "react";
import Image from "next/image";
import clsx from "clsx";
// import { CgSpinner } from "react-icons/cg";
import { CustomNumberInput } from "@/components/custom-number-input";
import FinalButton from "@/components/button/final.button";
import { PreBookingStats } from "@/lib/get-pre-bookings-stats/types";

interface Props {
  preBookingStats: PreBookingStats;
}

const Booking: React.FC<Props> = ({ preBookingStats }) => {
  const {
    receivable_token_symbol,
    payment_token_symbol,
    pre_booking: { is_sold_out },
  } = preBookingStats;
  const receivableTokenCollectionPercentage = 57;
  const receivableTokensCollected = 57;
  return (
    <div className="max-w-[628px] py-8 fmd:flex-grow">
      <div className="mt-3 h-[140px] rounded-2xl bg-[#1b1c22] bg-[url(/images/bg-launchpad.png)] bg-cover p-4 fsm:p-6 fmd:h-[158px] flg:p-8">
        <div className="flex items-center justify-between gap-10">
          <h6 className="text-xl font-semibold text-white">Staked</h6>
        </div>
        <div
          className={clsx(
            "relative mt-[22px] h-3 w-full overflow-hidden rounded-3xl",
            receivableTokenCollectionPercentage < 75 && `bg-[#76E268]/[0.16]`,
            receivableTokenCollectionPercentage >= 75 &&
              receivableTokenCollectionPercentage < 100 &&
              `bg-[#FEBF32]/[0.16]`,
            is_sold_out && `bg-[#E5535A]/[0.16]`
          )}
        >
          <div
            style={{ width: `${receivableTokenCollectionPercentage}%` }}
            className={clsx(
              receivableTokenCollectionPercentage < 75 && `bg-[#76E268]`,
              receivableTokenCollectionPercentage >= 75 &&
                receivableTokenCollectionPercentage < 100 &&
                `bg-brand-primary`,
              is_sold_out && `bg-[#EA3943]`,
              `absolute top-0 z-50 h-3 rounded-3xl`
            )}
          ></div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between">
          <p className="text-sm text-gray-shade-14">
            {receivableTokensCollected.toString().includes(".")
              ? receivableTokensCollected.toFixed(2)
              : receivableTokensCollected}{" "}
            {receivable_token_symbol}
          </p>
        </div>
      </div>
      {is_sold_out ? (
        <div className="mt-4 flex h-[74px] items-center rounded-xl bg-[#E5535A]/[0.06] py-3 px-4 text-sm text-[#E5535A]">
          All tokens have been booked! wait for Presale rounds to start in order
          to claim your tokens.
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-8 fmd:flex-row fmd:gap-4">
          <div className="relative flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-black-shade-3 p-3 focus-within:ring-1 focus-within:ring-brand-primary flg:max-w-full">
            <CustomNumberInput
              name={payment_token_symbol}
              id={payment_token_symbol}
              placeholder="00"
              className="foucs:outline-none w-full border-0 bg-transparent p-0 text-white focus:ring-0"
              // value={paymentForm.paymentTokenAmount}
              min={0}
              // onChange={(e) => {
              //   setPaymentForm({
              //     ...paymentForm,
              //     paymentTokenAmount:
              //       e.target.value === "" ? "" : Number(e.target.value),
              //   });
              // }}
            />

            <div className="flex w-full max-w-[60px] items-center gap-2">
              {/* TODO: Change this hard-coded icon to icon url coming from backend */}
              <Image
                src="/images/dexa-icon.png"
                alt="dexa"
                width={20}
                height={20}
                className="h-5 w-5 flex-shrink-0 object-cover"
              />
              <p className="text-xs font-semibold text-white">DeXa</p>
            </div>
          </div>
          {/* {isLoading === "loading" ? (
            <button className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-background-shade-2 py-[10px] px-2 text-sm font-semibold text-gray-shade-7 flg:max-w-[210px]">
              <CgSpinner className="h-5 w-5 animate-spin" />
            </button>
          ) : ( */}
          <FinalButton
            variant={"primary"}
            title="Stake Now"
            borderRounded={"14px"}
            className={clsx(
              "h-12 w-full text-sm fsm:flex-shrink-0 fmd:max-w-[130px]"
            )}
          />
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default Booking;
