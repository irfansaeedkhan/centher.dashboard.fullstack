import React, { useState } from "react";
import Image from "next/image";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { useIsClient } from "usehooks-ts";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { PreBookingStats } from "@/lib/get-pre-bookings-stats/types";
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import { CustomNumberInput } from "@/components/custom-number-input";
import { BlockchainWrite } from "@/web3/blockchain";
import useUser from "@/hooks/use.user";
import { LoadingState } from "@/models/common";
import { BUSDNEW, GreenTick } from "@/assets/svgs";
import { useWallet } from "@/web3/hooks/use.wallet";

interface Props {
  preBookingStats: PreBookingStats;
}

const BookingData: React.FC<Props> = ({ preBookingStats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingState>("idle");
  const [isNtrHolder, setIsNtrHolder] = useState(false);
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
    ntrBusdRate,
    ntrContractAddress,
    ntrMinimumAmount,
  } = preBookingStats;

  const receivableTokenPriceCurrentRound =
    rounds[current_round as keyof typeof rounds]
      .receivable_token_price_in_payment_token;

  const receivableTokenPriceCurrentRoundWithNTR =
    receivableTokenPriceCurrentRound / ntrBusdRate;

  const receivableTokensCollected = is_sold_out
    ? rounds[current_round as keyof typeof rounds].receivable_token_max_cap
    : rounds[current_round as keyof typeof rounds].receivable_tokens_collected;

  const receivableTokenMaxCap =
    rounds[current_round as keyof typeof rounds].receivable_token_max_cap;

  const receivableTokenCollectionPercentage =
    (receivableTokensCollected / receivableTokenMaxCap) * 100;

  const lastRoundLeftCapInPaymentToken = Math.ceil(
    // receivableTokenAmountToPaymentTokenAmount(
    //   current_round === 3
    //     ? rounds[3].receivable_token_max_cap -
    //         rounds[3].receivable_tokens_collected
    //     : 0,
    //   receivableTokenPriceCurrentRound
    // )
    current_round === 3
      ? rounds[3].receivable_token_max_cap -
          rounds[3].receivable_tokens_collected
      : 0
  );

  let minimumPaymentTokenAmount = isNtrHolder
    ? ntrMinimumAmount
    : minimum_payment_token_amount;

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

  const rate = isNtrHolder
    ? receivableTokenPriceCurrentRoundWithNTR
    : receivableTokenPriceCurrentRound;

  const receivableTokenAmount =
    typeof paymentForm.paymentTokenAmount === "number"
      ? paymentForm.paymentTokenAmount / rate
      : 0;

  const { getSigner, connectedAddress } = useWallet();

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

    if (!connectedAddress || !getSigner) {
      toast.error("Please connect your wallet for booking!");
      setIsLoading("loaded");
      return;
    }

    if (user._id.toLowerCase() !== connectedAddress.toLowerCase()) {
      toast.error("Please connect your wallet to correct account!");
      setIsLoading("loaded");
      return;
    }

    const contractAddress = isNtrHolder
      ? ntrContractAddress
      : payment_token_address;

    try {
      await BlockchainWrite.preBookDexa(
        paymentForm.paymentTokenAmount,
        payment_wallet_address,
        contractAddress,
        getSigner()!
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
    <div className="h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 px-4 pb-10 pt-[22px] fsm:px-6 flg:px-8 fxl:px-10">
      <div className="flex w-full flex-col gap-10 fmd:flex-row">
        <div className="mt-8 flex w-full flex-shrink-0 flex-col justify-between gap-6 fmd:w-[276px] fmd:flex-col fmd:justify-start">
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
            <Button
              variant={is_sold_out ? "danger" : "secondary"}
              title={is_sold_out ? "Pre Booking Ended" : "Pre Booking Live"}
            />
          </div>
          <div className="relative mt-3 flex h-14 w-full items-center justify-between gap-2 px-3 fmd:max-w-[275px]">
            <Image
              src={"/images/timer.png"}
              alt="timer"
              width={275}
              height={56}
              className="absolute left-0 top-0 m-auto h-[56px] w-full fmd:inset-0 fmd:w-[275px]"
            />
            <p className="text-sm font-medium text-gray-shade-14">
              The presale will start in
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
              <Button variant="secondary" title={`Round: ${current_round}`} />
            </div>
            <div
              className={clsx(
                "relative mt-[22px] h-3 w-full overflow-hidden rounded-3xl bg-[#21BF7F]/[0.16]"
              )}
            >
              <div
                style={{ width: `${receivableTokenCollectionPercentage}%` }}
                className={clsx(
                  `absolute top-0 z-50 h-3 rounded-3xl bg-[#21BF7F]`
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
          <p className="mt-4 text-xs text-white">
            If you are {isNtrHolder && "not a"} <b>NTR</b> Holder please{" "}
            <span
              className="textGradient cursor-pointer"
              onClick={() => setIsNtrHolder(!isNtrHolder)}
            >
              Click here
            </span>
          </p>
          {is_sold_out ? (
            <div className="mt-4 flex h-[74px] items-center rounded-xl bg-[#E5535A]/[0.06] px-4 py-3 text-sm text-[#E5535A]">
              All tokens have been booked! wait for Presale rounds to start in
              order to claim your tokens.
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-8 fmd:flex-row fmd:gap-4">
              <div className="focus-within:gradient-border-3 relative flex h-12 w-full items-center justify-between gap-2 !rounded-lg bg-black-shade-3 p-[1px] flg:max-w-full">
                <CustomNumberInput
                  name={payment_token_symbol}
                  id={payment_token_symbol}
                  placeholder="00"
                  className="foucs:outline-none w-full border-0 bg-transparent p-0 px-2 text-white focus:ring-0"
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
                {isNtrHolder ? (
                  <div className="flex w-full max-w-[60px] items-center gap-2">
                    {/* TODO: Change this hard-coded icon to icon url coming from backend */}
                    <Image
                      src="/images/ntr.png"
                      alt="NTR"
                      width={20}
                      height={20}
                      className="h-5 w-5 flex-shrink-0 object-cover"
                    />
                    <p className="text-xs font-semibold text-white">NTR</p>
                  </div>
                ) : (
                  <div className="mr-2 flex w-full max-w-[65px] items-center gap-2">
                    {/* TODO: Change this hard-coded icon to icon url coming from backend */}
                    <span className="h-5 w-5 flex-shrink-0 object-cover">
                      <BUSDNEW />
                    </span>
                    <p className="textGradient text-xs font-semibold">
                      {payment_token_symbol}
                    </p>
                  </div>
                )}
              </div>

              {isLoading === "loading" ? (
                <button className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-background-shade-2 px-2 py-[10px] text-sm font-semibold text-gray-shade-7 flg:max-w-[210px]">
                  <CgSpinner className="h-5 w-5 animate-spin" />
                </button>
              ) : (
                <Button
                  variant={"primary"}
                  title="Book Now"
                  borderRounded={"8px"}
                  disabled={
                    typeof paymentForm.paymentTokenAmount === "string" ||
                    paymentForm.paymentTokenAmount <
                      minimumPaymentTokenAmount ||
                    (current_round === 3 &&
                      receivableTokenAmount > lastRoundLeftCapInPaymentToken)
                  }
                  className={clsx(
                    "h-12 w-full fsm:flex-shrink-0 fmd:max-w-[210px] "
                  )}
                  onClick={
                    typeof paymentForm.paymentTokenAmount === "string" ||
                    paymentForm.paymentTokenAmount <
                      minimumPaymentTokenAmount ||
                    (current_round === 3 &&
                      receivableTokenAmount > lastRoundLeftCapInPaymentToken)
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
                  {minimumPaymentTokenAmount}{" "}
                  {isNtrHolder ? "NTR" : payment_token_symbol}
                </span>
                . Any amount less than that will not be considered for booking
                and <span className="font-medium">it will not be refunded</span>
                .
              </p>
            )}
            <p className={"text-[13px] text-gray-shade-14"}>
              <span className="text-red-400">Terms &amp; Conditions:</span>{" "}
              Purchased tokens will be automatically locked for the first 4
              months, after which 10% of the purchased tokens will be released
              every month for the next 10 months and can be claimed. The vesting
              contract will then last a total of 14 months.
            </p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CustomModal
          title="Pre-booking Confirmation"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="mb-4 mt-10 flex flex-col items-center space-y-2">
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
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <h6 className="text-xs font-semibold text-white">{days}</h6>
        <p className="text-[8px] font-medium text-white">DAYS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-xs font-semibold text-white">{hours}</h6>
        <p className="text-[8px] font-medium text-white">HOURS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-xs font-semibold text-white">{minutes}</h6>
        <p className="text-[8px] font-medium text-white">MIN</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-xs font-semibold text-white">{seconds}</h6>
        <p className="text-[8px] font-medium text-white">SEC</p>
      </div>
    </div>
  );
};
