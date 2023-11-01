import React from "react";
import { formatEther } from "ethers/lib/utils";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "@/components/button";
import { TokenName } from "@/web3/blockchain/types";
import { RoundInfo } from "@/web3/constants/types";
import { useWallet } from "@/web3/hooks/use.wallet";
import { LeftArrowIcon, NTRIconBG, DXCIconBG, USDTIcon } from "@/assets/svgs";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { ConversionTokenBox } from "./conversion-token-box";
import { inputBox, inputBoxLeft, inputBoxRight } from "./shared";

interface Props {
  selectedTokenA: SelectedTokenA;
  setSelectedTokenA: React.Dispatch<React.SetStateAction<SelectedTokenA>>;
  selectedTokenB: SelectedTokenB;
  setSelectedTokenB: React.Dispatch<React.SetStateAction<SelectedTokenB>>;
  roundInfo: RoundInfo;
}

export const ConversionContainer: React.FC<Props> = ({
  selectedTokenA,
  setSelectedTokenA,
  selectedTokenB,
  setSelectedTokenB,
  roundInfo,
}) => {
  const { connectedAddress } = useWallet();
  const handleChangeSelectedToken = (tokenName: TokenName) => {
    if (tokenName === "USDT") {
      setSelectedTokenA((prev) => ({
        ...prev,
        tokenName: "USDT",
        tokenIcon: (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/5">
            <USDTIcon />
          </span>
        ),
        minContribution: roundInfo.minContributionForBusd,
        maxContribution: roundInfo.maxContributionForBusd,
        rate: roundInfo.priceForBusd,

        inputValue: roundInfo.minContributionForBusd,
        inputMinValue: roundInfo.minContributionForBusd,
        inputMaxValue: roundInfo.maxContributionForBusd,
      }));
      setSelectedTokenB((prev) => ({
        ...prev,
        inputValue:
          roundInfo.minContributionForBusd /
          Number(formatEther(roundInfo.priceForBusd.toString())),
      }));
    } else if (tokenName === "NTR") {
      setSelectedTokenA((prev) => ({
        ...prev,
        tokenName: "NTR",
        tokenIcon: <NTRIconBG className="h-10 w-10" />,
        minContribution: roundInfo.minContributionForNtr,
        maxContribution: roundInfo.maxContributionForNtr,
        rate: roundInfo.priceForNtr,

        inputValue: roundInfo.minContributionForNtr,
        inputMinValue: roundInfo.minContributionForNtr,
        inputMaxValue: roundInfo.maxContributionForNtr,
      }));
      setSelectedTokenB((prev) => ({
        ...prev,
        inputValue:
          roundInfo.minContributionForNtr /
          Number(formatEther(roundInfo.priceForNtr.toString())),
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-5 flg:flex-row">
      <div className={conversionInputContainer}>
        <ConversionTokenBox
          tokenIcon={selectedTokenA.tokenIcon}
          tokenName={selectedTokenA.tokenName}
          tokenBalance={selectedTokenA.tokenBalance}
          // hasDropdown={true}
          onChangeSelectedToken={handleChangeSelectedToken}
        />
        <div className={inputBox}>
          <div className={clsx(inputBoxLeft)}>
            <input
              readOnly={roundInfo.status === "ended"}
              className={inputClasses}
              type="number"
              placeholder={selectedTokenA.inputMinValue?.toFixed(2)}
              value={selectedTokenA?.inputValue}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? e.target.value
                    : Number(e.target.value);

                setSelectedTokenA((prev) => ({
                  ...prev,
                  inputValue: value,
                }));
                setSelectedTokenB((prev) => ({
                  ...prev,
                  inputValue:
                    (value === "" ? 0 : value) /
                    Number(formatEther(selectedTokenA.rate.toString())),
                }));
              }}
              min={selectedTokenA?.inputMinValue}
              max={selectedTokenA?.inputMaxValue}
            />
          </div>
          <div className={inputBoxRight}>
            <div className="flex flex-grow justify-center">
              <Button
                title="Max"
                className="text-xs"
                onClick={() => {
                  if (!connectedAddress) {
                    toast.error("Please connect your wallet");
                    return;
                  }
                  setSelectedTokenA((prev) => ({
                    ...prev,
                    inputValue: selectedTokenA.tokenBalance,
                  }));
                  setSelectedTokenB((prev) => ({
                    ...prev,
                    inputValue:
                      selectedTokenA.tokenBalance /
                      Number(formatEther(selectedTokenA.rate.toString())),
                  }));
                }}
                disabled={roundInfo.status === "ended"}
              />
            </div>
          </div>
        </div>
      </div>
      <ConversionArrowLeft />
      <div className={conversionInputContainer}>
        <ConversionTokenBox
          tokenIcon={<DXCIconBG className="h-10 w-10" />}
          tokenName="DXC"
          tokenBalance={selectedTokenB.tokenBalance}
        />
        <div className={inputBox}>
          <div className={inputBoxLeft}>
            <input
              className={inputClasses}
              type="number"
              placeholder="0.00"
              value={formatNumber(selectedTokenB.inputValue)}
              readOnly
            />
          </div>

          <div className={inputBoxRight} />
        </div>
      </div>
    </div>
  );
};

const conversionInputContainer =
  "space-y-3 w-full fmd:max-w-[656px] flg:max-w-[354px]";
const inputClasses =
  "inputClasses flex-grow w-4/5 focus:outline-none focus:ring-0 outline-0 bg-transparent border-0 text-sm text-white font-semibold";
const ConversionArrowLeft = () => {
  return (
    <div className="flex h-16 w-16 rotate-90 transform cursor-pointer items-center justify-center rounded-full border-2 border-gray-shade-3 bg-gray-shade-9 transition hover:scale-110 fmd:h-20 fmd:w-20 flg:rotate-0 f2xl:h-[100px] f2xl:w-[100px]">
      <LeftArrowIcon />
    </div>
  );
};

// format number to maximum 18 decimal places and minimum required
export const formatNumber = (num: number) => {
  const numStr = num.toString();
  const numArr = numStr.split(".");
  if (numArr.length > 1) {
    const decimal = numArr[1];

    if (decimal.length > 18) {
      return Number(numStr.slice(0, numStr.length - (decimal.length - 18)));
    }
  }
  return num;
};
