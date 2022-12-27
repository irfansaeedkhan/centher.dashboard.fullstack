import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { HiChevronDown } from "react-icons/hi";

import { TokenName } from "@/web3/utils/call.helpers";
import { BUSDIcon, NTRIcon } from "@/assets/svgs";

import { inputBox, inputBoxLeft, inputBoxRight } from "./shared";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tokenName: TokenName;
  tokenIcon: React.ReactNode;
  tokenBalance: number;
  hasDropdown?: boolean;
  onChangeSelectedToken?: (tokenName: TokenName) => void;
}

export const ConversionTokenBox: React.FC<Props> = ({
  tokenName,
  tokenIcon,
  tokenBalance,
  className,
  hasDropdown = false,
  onChangeSelectedToken = () => {},
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className={clsx(inputBox, className)} {...props}>
      <div className={clsx(inputBoxLeft, "relative")}>
        <div className="flex items-center justify-between flex-grow">
          <div className="flex items-center flex-grow">
            {tokenIcon}
            <span
              className={`ml-2 inline-block text-xs fmd:text-sm text-white font-semibold`}
            >
              {tokenName}
            </span>
          </div>
        </div>

        {hasDropdown && (
          <div ref={dropdownRef}>
            <button
              className="p-2"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <HiChevronDown className="w-5 h-5 fsm:w-6 fsm:h-6 fill-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] -left-1 w-full bg-popup-0 z-50 rounded-10px text-xs fmd:text-sm text-white font-medium">
                <div
                  className="cursor-pointer py-3 px-5 flex items-center border-b border-gray-shade-border-color"
                  onClick={() => {
                    onChangeSelectedToken("BUSD");
                    setIsDropdownOpen(false);
                  }}
                >
                  <BUSDIcon className="w-8 h-8" />
                  <span className="inline-block ml-3">BUSD</span>
                </div>
                <div
                  className="cursor-pointer py-3 px-5 flex items-center"
                  onClick={() => {
                    onChangeSelectedToken("NTR");
                    setIsDropdownOpen(false);
                  }}
                >
                  <NTRIcon className="w-8 h-8" />
                  <span className="inline-block ml-3">NTR</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={inputBoxRight}>
        <div>
          <div
            className={`text-xs fmd:text-sm text-gray-shade-7 font-semibold`}
          >
            Balance
          </div>
          <span
            className={`text-xs fmd:text-sm text-white font-semibold`}
            title={tokenBalance.toString()}
          >
            {tokenBalance < 9999999 && tokenBalance.toString().length < 7
              ? tokenBalance
              : tokenBalance.toString().slice(0, 7) + "+"}
          </span>
        </div>
      </div>
    </div>
  );
};
