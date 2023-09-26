import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { NTRIcon, USDTIcon } from "@/assets/svgs";
import { TokenName } from "@/web3/blockchain/types";
import {
  inputBox,
  inputBoxLeft,
  inputBoxRight,
  truncateTokenAmount,
} from "./shared";

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
  hasDropdown = true,
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
        <div className="flex flex-grow items-center justify-between">
          <div className="flex flex-grow items-center">
            {tokenIcon}
            <span className="ml-2 inline-block text-xs font-semibold text-white fmd:text-sm">
              {tokenName}
            </span>
          </div>
        </div>
        {hasDropdown && tokenName !== "DXC" && (
          <div ref={dropdownRef} className="h-5 w-5 fsm:h-6 fsm:w-6">
            <button
              className=""
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {isDropdownOpen ? (
                <HiChevronUp className="h-5 w-5 fill-white fsm:h-6 fsm:w-6" />
              ) : (
                <HiChevronDown className="h-5 w-5 fill-white fsm:h-6 fsm:w-6" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute -left-1 top-[calc(100%+6px)] z-50 w-full rounded-10px bg-popup-0 text-xs font-medium text-white fmd:text-sm">
                <div
                  className="flex cursor-pointer items-center border-b border-gray-shade-border-color px-5 py-3"
                  onClick={() => {
                    onChangeSelectedToken("USDT");
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                    <USDTIcon />
                  </span>
                  <span className="ml-3 inline-block">USDT</span>
                </div>
                <div
                  className="flex cursor-pointer items-center px-5 py-3"
                  onClick={() => {
                    onChangeSelectedToken("NTR");
                    setIsDropdownOpen(false);
                  }}
                >
                  <NTRIcon className="h-8 w-8" />
                  <span className="ml-3 inline-block">NTR</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={inputBoxRight}>
        <div>
          <div className="text-xs font-semibold text-gray-shade-7 fmd:text-sm">
            Balance
          </div>
          <span
            className="text-xs font-semibold text-white fmd:text-sm"
            title={tokenBalance.toString()}
          >
            {truncateTokenAmount(tokenBalance, 9999999)}
          </span>
        </div>
      </div>
    </div>
  );
};
