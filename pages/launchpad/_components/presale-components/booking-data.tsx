import React, { useState } from "react";
import Image from "next/image";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { useIsClient } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

import { receivableTokenAmountToPaymentTokenAmount } from "@/lib/get-pre-bookings-stats";
import { PreBookingStats } from "@/lib/get-pre-bookings-stats/types";
import NewButton from "@/components/button/new.button";
import { CustomModal } from "@/components/modal/custom.modal";
import { CustomNumberInput } from "@/components/custom-number-input";
import { BlockchainWrite } from "@/web3/blockchain";
import useUser from "@/hooks/use.user";
import { LoadingState } from "@/models/common";
import { BUSDNEW, GreenTick } from "@/assets/svgs";

interface Props {
  preBookingStats: PreBookingStats;
}

const BookingData: React.FC<Props> = ({ preBookingStats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingState>("idle");
  const isClient = useIsClient();
  const { user } = useUser();

  const {
    receivable_token_name,
    receivable_token_image,
    receivable_token_symbol,
    payment_token_symbol,
    payment_token_address,
    pre_booking: {
      minimum_payment_token_amount,
      is_sold_out,
      current_round,
      rounds,
      payment_wallet_address,
    },
    presale,
  } = preBookingStats;

  const receivableTokenPriceCurrentRound =
    rounds[current_round as keyof typeof rounds]
      .receivable_token_price_in_payment_token;

  const receivableTokensCollected = is_sold_out
    ? rounds[current_round as keyof typeof rounds].receivable_token_max_cap
    : rounds[current_round as keyof typeof rounds].receivable_tokens_collected;

  const receivableTokenMaxCap =
    rounds[current_round as keyof typeof rounds].receivable_token_max_cap;

  const receivableTokenCollectionPercentage =
    (receivableTokensCollected / receivableTokenMaxCap) * 100;

  const lastRoundLeftCapInPaymentToken = Math.ceil(
    receivableTokenAmountToPaymentTokenAmount(
      current_round === 3
        ? rounds[3].receivable_token_max_cap -
            rounds[3].receivable_tokens_collected
        : 0,
      receivableTokenPriceCurrentRound
    )
  );

  let minimumPaymentTokenAmount = minimum_payment_token_amount;

  if (
    current_round === 3 &&
    lastRoundLeftCapInPaymentToken < minimumPaymentTokenAmount
  ) {
    minimumPaymentTokenAmount = lastRoundLeftCapInPaymentToken;
  }

  const [paymentForm, setPaymentForm] = useState<{
    paymentTokenAmount: string | number;
  }>({
    paymentTokenAmount: "",
  });

  const receivableTokenAmount =
    typeof paymentForm.paymentTokenAmount === "number"
      ? paymentForm.paymentTokenAmount / receivableTokenPriceCurrentRound
      : 0;

  const { library, account } = useWeb3React();

  const bookNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading("loading");
    if (
      typeof paymentForm.paymentTokenAmount !== "number" ||
      paymentForm.paymentTokenAmount === 0 ||
      !user
    ) {
      setIsLoading("loaded");
      return;
    }

    if (!account || !library) {
      toast.error("Please connect your wallet for booking!");
      setIsLoading("loaded");
      return;
    }

    if (user.account_address.toLowerCase() !== account.toLowerCase()) {
      toast.error("Please connect your wallet to correct account!");
      setIsLoading("loaded");
      return;
    }

    try {
      await BlockchainWrite.preBookDexa(
        paymentForm.paymentTokenAmount,
        payment_wallet_address,
        payment_token_address,
        library
      );

      setPaymentForm({
        paymentTokenAmount: "",
      });

      setIsLoading("loaded");
      setIsModalOpen(true);
    } catch (err: any) {
      if (
        err.reason?.toLowerCase().includes("transfer amount exceeds balance")
      ) {
        toast.error(`${payment_token_symbol}: Insufficient balance`);
      } else if (
        err.reason?.toLowerCase().includes("user rejected") ||
        err.message?.toLowerCase().includes("user rejected")
      ) {
        toast.error("User rejected the transaction");
      } else {
        toast.error("Something is wrong! Please try again later.");
      }
      setIsLoading("loaded");
    }
  };

  return (
    <div className="h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 px-4 pt-[22px] pb-10 fsm:px-6 flg:px-8 fxl:px-10">
      <div className="flex w-full flex-col gap-10 fmd:flex-row">
        <div className="mt-8 flex w-full flex-col justify-between gap-6 fsm:flex-row fmd:w-[233px] fmd:flex-col fmd:justify-start">
          <div className="flex flex-col">
            <Image
              src={receivable_token_image}
              alt={receivable_token_name}
              width={80}
              height={80}
              className="mb-4 rounded-full"
            />
            <h5 className="mb-2 text-2xl font-semibold text-white">
              {receivable_token_name}
            </h5>
            <NewButton
              variant={is_sold_out ? "v12" : "v11"}
              title={is_sold_out ? "Pre Booking Ended" : "Pre Booking Live"}
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-shade-14">
              The presale for {receivable_token_name} will start in
            </p>

            {isClient && (
              <Countdown
                date={new Date(presale.rounds[1].start_time * 1000)}
                renderer={countdownRenderer}
              />
            )}
          </div>
        </div>
        <div className="fmd:flex-grow">
          <p className="w-full text-end text-sm text-gray-shade-14">
            1 {receivable_token_symbol} = {receivableTokenPriceCurrentRound}{" "}
            {payment_token_symbol}
          </p>
          <div className="mt-3 h-[140px] rounded-2xl bg-[#1b1c22] bg-[url(/images/bg-launchpad.png)] bg-cover p-4 fsm:p-6 fmd:h-[158px] flg:p-8">
            <div className="flex items-center justify-between gap-10">
              <h6 className="text-xl font-semibold text-white">Booking</h6>
              <NewButton variant="v11" title={`Round: ${current_round}`} />
            </div>
            <div
              className={clsx(
                "relative mt-[22px] h-3 w-full overflow-hidden rounded-3xl",
                receivableTokenCollectionPercentage < 75 &&
                  `bg-[#76E268]/[0.16]`,
                receivableTokenCollectionPercentage >= 75 &&
                  receivableTokenCollectionPercentage < 100 &&
                  `bg-[#FEBF32]/[0.16]`,
                (receivableTokenCollectionPercentage === 100 || is_sold_out) &&
                  `bg-[#E5535A]/[0.16]`
              )}
            >
              <div
                style={{ width: `${receivableTokenCollectionPercentage}%` }}
                className={clsx(
                  receivableTokenCollectionPercentage < 75 && `bg-[#76E268]`,
                  receivableTokenCollectionPercentage >= 75 &&
                    receivableTokenCollectionPercentage < 100 &&
                    `bg-brand-primary`,
                  (receivableTokenCollectionPercentage === 100 ||
                    is_sold_out) &&
                    `bg-[#EA3943]`,
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
              <p className="text-sm text-gray-shade-14">
                {receivableTokenMaxCap.toString().includes(".")
                  ? receivableTokenMaxCap.toFixed(2)
                  : receivableTokenMaxCap}{" "}
                {receivable_token_symbol}
              </p>
            </div>
          </div>
          {is_sold_out ? (
            <div className="mt-9 flex h-[74px] items-center rounded-xl bg-[#E5535A]/[0.06] py-3 px-4 text-sm text-[#E5535A]">
              All tokens have been booked! wait for Presale rounds to start in
              order to claim your tokens.
            </div>
          ) : (
            <div className="mt-9 flex flex-col items-center gap-8 fmd:flex-row fmd:gap-4">
              <div className="relative flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-black-shade-3 p-3 focus-within:ring-1 focus-within:ring-brand-primary flg:max-w-full">
                <CustomNumberInput
                  name={payment_token_symbol}
                  id={payment_token_symbol}
                  placeholder="00"
                  className="foucs:outline-none w-full border-0 bg-transparent p-0 text-white focus:ring-0"
                  value={paymentForm.paymentTokenAmount}
                  min={0}
                  onChange={(e) => {
                    setPaymentForm({
                      ...paymentForm,
                      paymentTokenAmount:
                        e.target.value === "" ? "" : Number(e.target.value),
                    });
                  }}
                />
                <p className="absolute bottom-[-20px] left-0 text-xs text-gray-shade-14">
                  {" "}
                  ={" "}
                  {receivableTokenAmount.toString().includes(".")
                    ? receivableTokenAmount.toFixed(2)
                    : receivableTokenAmount}{" "}
                  {receivable_token_symbol}
                </p>
                <div className="flex items-center gap-2">
                  {/* TODO: Change this hard-coded icon to icon url coming from backend */}
                  <BUSDNEW />
                  <p className="text-xs font-semibold text-brand-primary">
                    {payment_token_symbol}
                  </p>
                </div>
              </div>
              {isLoading === "loading" ? (
                <button className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-background-shade-2 py-[10px] px-2 text-sm font-semibold text-gray-shade-7 flg:max-w-[210px]">
                  <CgSpinner className="h-5 w-5 animate-spin" />
                </button>
              ) : (
                <NewButton
                  variant={
                    typeof paymentForm.paymentTokenAmount === "string" ||
                    paymentForm.paymentTokenAmount <
                      minimumPaymentTokenAmount ||
                    (current_round === 3 &&
                      paymentForm.paymentTokenAmount >
                        lastRoundLeftCapInPaymentToken)
                      ? "v2"
                      : "v1"
                  }
                  title="Book Now"
                  disabled={
                    typeof paymentForm.paymentTokenAmount === "string" ||
                    paymentForm.paymentTokenAmount <
                      minimumPaymentTokenAmount ||
                    (current_round === 3 &&
                      paymentForm.paymentTokenAmount >
                        lastRoundLeftCapInPaymentToken)
                  }
                  className={clsx("flg:max-w-[210px]")}
                  onClick={
                    typeof paymentForm.paymentTokenAmount === "string" ||
                    paymentForm.paymentTokenAmount <
                      minimumPaymentTokenAmount ||
                    (current_round === 3 &&
                      paymentForm.paymentTokenAmount >
                        lastRoundLeftCapInPaymentToken)
                      ? () => {}
                      : bookNow
                  }
                />
              )}
            </div>
          )}
          <div className="mt-4 space-y-3 fmd:mt-8">
            {!is_sold_out && (
              <p className="text-[13px] text-gray-shade-14">
                <span className="text-red-400">Note:</span> Minimum booking is{" "}
                <span className="font-medium">
                  {minimumPaymentTokenAmount} {payment_token_symbol}
                </span>
                . Any amount less than that will not be considered for booking
                and <span className="font-medium">it will not be refunded</span>
                .
              </p>
            )}
            <p className={"text-[13px] text-gray-shade-14"}>
              <span className="text-red-400">Terms &amp; Conditions:</span> The
              purchased tokens will be locked automatically for 6 months, after
              which 5% of the purchased tokens will be released every month and
              possible to claim.
            </p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CustomModal
          title="Pre-booking Confirmation"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="mt-10 mb-4 flex flex-col items-center space-y-2">
            <GreenTick />
            <p className="text-center text-base font-semibold text-white fmd:text-lg">
              Your payment for {receivable_token_name} pre-booking is successful
            </p>
            <p className="text-center text-xs font-medium text-gray-shade-14 fmd:text-sm">
              You will get a confirmation notification in 5 to 10 minutes.
            </p>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default BookingData;

// Countdown Renderer
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{days}</h6>
        <p className="text-[10px] font-medium text-white">DAYS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{hours}</h6>
        <p className="text-[10px] font-medium text-white">HOURS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{minutes}</h6>
        <p className="text-[10px] font-medium text-white">MIN</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{seconds}</h6>
        <p className="text-[10px] font-medium text-white">SEC</p>
      </div>
    </div>
  );
};
