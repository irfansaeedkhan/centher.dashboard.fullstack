import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CustomNumberInput } from "@/components/custom-number-input";
import FinalButton from "@/components/button/final.button";
import { ZeroAddress } from "@/web3/constants/common";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";

export interface StakingStat {
  totalStakedAmount: string;
  totalStakingCap: string;
  tokenAddress: string;
}

interface Props {
  data: StakingStat;
  onValueChanged: (val: number) => void;
  onSubmit: (referrer: string) => void;
  coins: Array<CoinDetails | undefined>;
}

const Booking: React.FC<Props> = ({
  data,
  onValueChanged,
  onSubmit,
  coins,
}) => {
  const { totalStakedAmount, totalStakingCap, tokenAddress } = data;
  const [filled, setFilled] = useState(0);
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    setFilled((+totalStakedAmount / +totalStakingCap) * 100);
  }, [totalStakedAmount, totalStakingCap]);

  return (
    <div className="w-full max-w-[512px] flex-shrink-0">
      <div className="h-[140px] rounded-2xl bg-[#1b1c22] bg-[url(/images/bg-launchpad.png)] bg-cover p-4 fsm:p-6 fmd:h-[158px] flg:p-8">
        <div className="flex items-center justify-between gap-10">
          <h6 className="text-xl font-semibold text-white">Staked</h6>
        </div>
        <div
          className={clsx(
            "relative mt-[22px] h-3 w-full overflow-hidden rounded-3xl",
            filled < 75 && `bg-[#76E268]/[0.16]`,
            filled >= 75 && filled < 100 && `bg-[#FEBF32]/[0.16]`,
            filled == 100 && `bg-[#E5535A]/[0.16]`
          )}
        >
          <div
            style={{ width: `${filled}%` }}
            className={clsx(
              filled < 75 && `bg-[#76E268]`,
              filled >= 75 && filled < 100 && `bg-brand-primary`,
              filled == 100 && `bg-[#EA3943]`,
              `absolute top-0 z-50 h-3 rounded-3xl`
            )}
          ></div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between">
          <p className="text-sm text-gray-shade-14">
            {/* {(+normalizeValue(formatUnits(totalStakedAmount + "", 18))).toFixed(
              2
            )} */}
            {totalStakedAmount}{" "}
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, data.tokenAddress)
              )?.symbol
            }
          </p>
        </div>
      </div>
      {filled == 100 ? (
        <div className="mt-4 flex h-[74px] items-center rounded-xl bg-[#E5535A]/[0.06] px-4 py-3 text-sm text-[#E5535A]">
          All tokens have been booked! wait for Presale rounds to start in order
          to claim your tokens.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-white">
            Referrals<span className="text-gray-shade-14">(Optional)</span>
          </p>
          <input
            onChange={(e) => {
              setReferrer(e.target.value);
            }}
            type="text"
            placeholder="Add referrals here"
            className="w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm text-white focus:ring-1 focus:ring-brand-primary"
          />
          <p className="text-sm text-white">Add Value</p>
          <div className="relative flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-black-shade-3 p-3 focus-within:ring-1 focus-within:ring-brand-primary flg:max-w-full">
            <CustomNumberInput
              name={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, data.tokenAddress)
                )?.symbol
              }
              id={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, data.tokenAddress)
                )?.symbol
              }
              placeholder="00"
              className="foucs:outline-none w-full border-0 bg-transparent p-0 text-white focus:ring-0"
              // value={paymentForm.paymentTokenAmount}
              min={0}
              onChange={(e) => {
                onValueChanged(+e.target.value);
              }}
            />

            <div className="flex w-full max-w-[60px] items-center gap-2">
              {/* TODO: Change this hard-coded icon to icon url coming from backend */}
              <Image
                src={
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.logo
                    ? (coins.find((e) =>
                        eqAddress(e?.contractAddress, data.tokenAddress)
                      )?.logo as string)
                    : "/images/dexa-icon.png"
                }
                alt={
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.symbol as string
                }
                width={20}
                height={20}
                className="h-5 w-5 flex-shrink-0 object-cover"
              />
              <p className="text-xs font-semibold text-white">
                {
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.symbol
                }
              </p>
            </div>
          </div>
          <FinalButton
            variant={"primary"}
            title="Stake Now"
            borderRounded={"14px"}
            className={clsx("mt-3 h-12 w-full text-sm")}
            onClick={() => onSubmit(referrer?.length ? referrer : ZeroAddress)}
          />
        </div>
      )}
    </div>
  );
};

export default Booking;
