import React from "react";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

import { TokenName } from "@/web3/utils/call.helpers";
import { RoundInfo } from "@/web3/constants/types";
import {
  BUSDIconBG,
  LeftArrowIcon,
  NTRDAOIconBG,
  NTRIconBG,
} from "@/assets/svgs";

import { SelectedTokenA, SelectedTokenB } from "./types";
import { ConversionTokenBox } from "./conversion.token.box";
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
  const { account } = useWeb3React();

  const handleChangeSelectedToken = (tokenName: TokenName) => {
    if (tokenName === "BUSD") {
      setSelectedTokenA((prev) => ({
        ...prev,
        tokenName: "BUSD",
        tokenIcon: <BUSDIconBG className="w-10 h-10" />,
        minContribution: roundInfo.minContributionForBusd,
        maxContribution: roundInfo.maxContributionForBusd,
        rate: roundInfo.rateForBusd,

        inputValue: roundInfo.minContributionForBusd,
        inputMinValue: roundInfo.minContributionForBusd,
        inputMaxValue: roundInfo.maxContributionForBusd,
      }));
    } else if (tokenName === "NTR") {
      setSelectedTokenA((prev) => ({
        ...prev,
        tokenName: "NTR",
        tokenIcon: <NTRIconBG className="w-10 h-10" />,
        minContribution: roundInfo.minContributionForNtr,
        maxContribution: roundInfo.maxContributionForNtr,
        rate: roundInfo.rateForNtr,

        inputValue: roundInfo.minContributionForNtr,
        inputMinValue: roundInfo.minContributionForNtr,
        inputMaxValue: roundInfo.maxContributionForNtr,
      }));
    }
  };

  return (
    <div
      className={`flex flex-col flg:flex-row items-center justify-between gap-5`}
    >
      <div className={conversionInputContainer}>
        <ConversionTokenBox
          tokenIcon={selectedTokenA.tokenIcon}
          tokenName={selectedTokenA.tokenName}
          tokenBalance={selectedTokenA.tokenBalance}
          hasDropdown={true}
          onChangeSelectedToken={handleChangeSelectedToken}
        />

        <div className={inputBox}>
          <div className={clsx(inputBoxLeft)}>
            <input
              className={inputClasses}
              type="number"
              placeholder={selectedTokenA.inputMinValue.toFixed(2)}
              value={selectedTokenA.inputValue}
              onChange={(e) => {
                const value = Number(e.target.value);

                setSelectedTokenA((prev) => ({
                  ...prev,
                  inputValue: value,
                }));
                setSelectedTokenB((prev) => ({
                  ...prev,
                  inputValue: value * selectedTokenA.rate,
                }));
              }}
              min={selectedTokenA.inputMinValue}
              max={selectedTokenA.inputMaxValue}
            />
          </div>

          <div className={inputBoxRight}>
            <div className={`flex-grow flex justify-center`}>
              <button
                className={`cursor-pointer text-xs fmd:text-sm text-yellow-theme font-medium border-2 border-gray-shade-3 bg-gray-shade-9 rounded-2xl px-3 py-1 transition hover:bg-yellow-theme hover:text-black-shade-3 hover:border-0`}
                onClick={() => {
                  if (!account) {
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
                      selectedTokenA.tokenBalance * selectedTokenA.rate,
                  }));
                }}
              >
                Max
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConversionArrowLeft />

      <div className={conversionInputContainer}>
        <ConversionTokenBox
          tokenIcon={<NTRDAOIconBG className="w-10 h-10" />}
          tokenName="CTHR"
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

const conversionInputContainer = `space-y-3 w-full fmd:max-w-[656px] flg:max-w-[354px]`;
const inputClasses = `inputClasses flex-grow w-4/5 focus:outline-none focus:ring-0 outline-0 bg-transparent border-0 text-sm text-gray-shade-7 font-semibold`;

const ConversionArrowLeft = () => {
  return (
    <div
      className={`transform rotate-90 flg:rotate-0 cursor-pointer w-16 h-16 fmd:w-20 fmd:h-20 f2xl:w-[100px] f2xl:h-[100px] bg-gray-shade-9 border-2 border-gray-shade-3 flex items-center justify-center transition hover:scale-110 rounded-full`}
    >
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
