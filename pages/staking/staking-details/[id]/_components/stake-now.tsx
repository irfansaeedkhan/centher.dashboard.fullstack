import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";
import { CustomNumberInput } from "@/components/custom-number-input";
import Button from "@/components/button";
import { ZeroAddress } from "@/web3/constants/common";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/lib/chat/utils";
import { Staking } from "@/assets/svgs";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainRead } from "@/web3/blockchain";
import { BigNumber } from "ethers";

export interface StakingStat {
  totalStakedAmount: string;
  totalStakingCap: string;
  tokenAddress: string;
  minAmount: string;
  maxAmount: string;
}

interface Props {
  data: StakingStat;
  onValueChanged: (val: string) => void;
  onSubmit: (referrer: string) => void;
  coins: Array<CoinDetails | undefined>;
  start: string;
  stakingLoader: boolean;
  connectedAddress: string | null | undefined;
  walletModal: () => void;
  signer: any;
  amount: number;
}

const Booking: React.FC<Props> = ({
  data,
  onValueChanged,
  onSubmit,
  coins,
  start,
  stakingLoader,
  connectedAddress,
  walletModal,
  signer,
  amount,
}) => {
  const { totalStakedAmount, totalStakingCap, tokenAddress } = data;
  const [filled, setFilled] = useState(0);
  const [referrer, setReferrer] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    let supply = totalStakingCap;
    if (!totalStakingCap || +totalStakingCap == 0) {
      supply = "999999999999999999";
    }

    const percentage = (+totalStakedAmount / +supply) * 100;
    setFilled(Math.ceil(percentage));
  }, [totalStakedAmount, totalStakingCap]);

  useEffect(() => {
    if (connectedAddress && signer && data) {
      BlockchainRead.getERC20Balance(
        connectedAddress,
        data.tokenAddress,
        signer
      ).then((balance) => {
        setUserBalance(+balance);
      });
    }
  }, [connectedAddress, signer, data]);

  const setBalanceAsInput = (amount: number) => onValueChanged(amount + "");

  return (
    <div className="w-full flex-shrink-0 flg:max-w-[512px]">
      {filled == 100 ? (
        <div className="mt-4 flex h-[74px] items-center rounded-xl bg-[#E5535A]/[0.06] px-4 py-3 text-sm text-[#E5535A]">
          All tokens have been booked! wait for Presale rounds to start in order
          to claim your tokens.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-white">Add Value</p>
          <div className="focus-within:gradient-border-3 flex items-center gap-2 !rounded-lg bg-[#17181A] p-[1px] text-white">
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
              className="block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 bg-transparent px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
              value={amount === 0 ? "" : amount}
              min={0}
              onChange={(e) => {
                onValueChanged(e.target.value);
              }}
              disabled={stakingLoader == true}
            />

            <div className="mr-3 flex w-full max-w-[60px] items-center gap-2">
              {coins.find((e) =>
                eqAddress(e?.contractAddress, data.tokenAddress)
              )?.logo ? (
                <Image
                  alt={
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, data.tokenAddress)
                    )?.symbol as string
                  }
                  src={
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, data.tokenAddress)
                    )?.logo as string
                  }
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0 object-cover"
                />
              ) : (
                <Staking className="h-5 w-5 stroke-white group-hover:[&>*]:stroke-white" />
              )}

              <p className="text-xs font-semibold text-white">
                {
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.symbol
                }
              </p>
            </div>
          </div>
          <div className={mainSection}>
            <div className={label}>
              <span className={label}>Min Amount:</span>
              <span className={value}>
                {" "}
                {Number(formatEther(data.minAmount)).toFixed(0)}{" "}
                {
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.symbol
                }
              </span>
            </div>

            {+data.maxAmount > 0 && (
              <div className={value}>
                <span className={label}>Max Amount:</span>
                <span className={value}>
                  {" "}
                  {Number(formatEther(data.maxAmount)).toFixed(0)}{" "}
                  {
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, data.tokenAddress)
                    )?.symbol
                  }
                </span>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col justify-between gap-5 fsm:flex-row fsm:items-center">
            <div className={label}>
              <span className={label}>Balance = </span>
              <span
                className={`flex-shrink-0 text-xs font-medium text-white fxm:text-sm`}
              >
                {" "}
                {+userBalance.toFixed(2)}{" "}
                {
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, data.tokenAddress)
                  )?.symbol
                }
              </span>
            </div>

            <div className={value}>
              <Button
                disabled={userBalance == 0 || stakingLoader == true}
                variant={"primary"}
                title="select"
                borderRounded={"14px"}
                className={clsx("w-full text-sm fsm:w-fit")}
                onClick={() => setBalanceAsInput(userBalance)}
              />
            </div>
          </div>

          {connectedAddress === null ? (
            <Button
              variant={"primary"}
              title="Connect Wallet"
              borderRounded={"14px"}
              className={clsx("w-full text-sm")}
              onClick={walletModal}
            />
          ) : +new Date(+start * 1000) <= +new Date() ? (
            <Button
              variant={"primary"}
              title="Stake Now"
              borderRounded={"14px"}
              className={clsx("w-full text-sm")}
              onClick={() =>
                onSubmit(referrer?.length ? referrer : ZeroAddress)
              }
              loaderIcon={
                stakingLoader ? (
                  <CgSpinner className="h-5 animate-spin text-white" />
                ) : undefined
              }
            />
          ) : (
            <p className="text-md mt-3 text-center text-white">
              This pool will start working from{" "}
              <span className="text-md text-gray-shade-14">
                {new Date(+start * 1000).toLocaleDateString()}{" "}
                {new Date(+start * 1000).toLocaleTimeString()}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Booking;

const label = `text-sm text-gray-shade-14`;
const value = `text-sm font-medium text-white flex-shrink-0`;
const mainSection = `flex w-full items-center justify-between gap-5`;
