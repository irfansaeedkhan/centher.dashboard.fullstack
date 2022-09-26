// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { BUSDIcon, NTRDAOIcon, LeftArrowIcon, LockedIcon } from "@/assets/svgs";

interface PurchaseNTRDAOCardProps {
  locked?: boolean;
}
export const PurchaseNTRDAOCard: React.FC<PurchaseNTRDAOCardProps> = ({
  locked,
}) => {
  const buyNowFunc = () => {
    console.log("buyNow");
  };
  return (
    <div className="relative">
      <div className={`${locked ? "block" : "hidden"} ${lockedContainer}`}>
        <div className={lockedContent}>
          <LockedIcon className="w-[80px] h-[80px]" />
          <h6 className={lockedContentMessage}>
            Need a messsage to show for users
          </h6>
        </div>
      </div>
      <div
        className={`${
          locked && "blur-xl bg-black-shade-3/60"
        } ${transactionBox} `}
      >
        <h1 className={transactionBoxTitle}>
          Please Enter NTRDAO amount to you’d like to purchase
        </h1>
        <div className={divider}></div>
        <div className={conversionBox}>
          <div className={ConversioninputContainer}>
            <div className={inputBox}>
              <div className={coinBox}>
                <BUSDIcon /> <h5 className={coinName}>BUSD </h5>
              </div>
              <div className={balanceBox}>
                <div>
                  <h5 className={balanceText}>Balance</h5>
                  <h6 className={balanceNumber}>0.00</h6>
                </div>
              </div>
            </div>
            <div className={inputBox}>
              <input className={input} type="text" placeholder="0.00" />
              <div className={maxBtnContainer}>
                <div>
                  <button className={maxBtn}>Max</button>
                </div>
              </div>
            </div>
          </div>
          <div className={conversionBtn}>
            <LeftArrowIcon />
          </div>
          <div className={ConversioninputContainer}>
            <div className={inputBox}>
              <div className={coinBox}>
                <NTRDAOIcon /> <h5 className={coinName}>NTRDAO </h5>
              </div>
              <div className={balanceBox}>
                <div>
                  <h5 className={balanceText}>Balance</h5>
                  <h6 className={balanceNumber}>0.00</h6>
                </div>
              </div>
            </div>
            <div className={inputBox}>
              <input className={input} type="text" placeholder="0.00" />
              <div className={maxBtnContainer}></div>
            </div>
          </div>
        </div>
        <div className={conversionBoxFooter}>
          <h6 className={conversionBoxFooterTitle}>
            Price:{" "}
            <span className={conversionBoxFooterTitleBold}>500 BUSD</span>
          </h6>
          <Button
            title={"Buy Now"}
            variant="v1"
            onClick={buyNowFunc}
            className="py-4"
          />
        </div>
      </div>
    </div>
  );
};

// stying
const lockedContainer = ctl(`
absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center
`);
const lockedContent = ctl(`
flex flex-col justify-center items-center gap-10
`);
const lockedContentMessage = ctl(`
text-20px font-semibold text-white
`);
const transactionBox = ctl(`
bg-background-shade-3 p-8 lg:p-12 rounded-2xl
`);
const transactionBoxTitle = ctl(`
text-24px text-white text-center font-semibold
`);
const divider = ctl(`
h-[2px] my-8 lg:my-12  bg-gray-shade-3
`);
const conversionBox = ctl(`
 flex flex-col lg:flex-row items-center justify-between   gap-5
`);
const ConversioninputContainer = ctl(`
space-y-3  w-full lg:max-w-[354px]
`);
const inputBox = ctl(`
overflow-hidden relative w-full h-[64px] bg-gray-shade-9 border-2 border-gray-shade-3 rounded-2xl px-3  py-4
`);
const input = ctl(`
focus:outline-none  focus:ring-0 outline-0 bg-transparent border-0 items-center absolute top-0 left-0 p-4 w-[calc(100% - 105px)] h-full text-14px text-gray-shade-7 font-semibold
`);
const coinBox = ctl(`
flex items-center gap-3 absolute top-[50%] translate-y-[-50%] left-4
`);
const coinName = ctl(`
text-14px text-white font-semibold
`);
const balanceBox = ctl(`
bg-background-shade-3 pl-4 absolute top-[50%] translate-y-[-50%] right-0 w-full max-w-[95px] lg:max-w-[115px] h-full flex items-center
`);
const balanceText = ctl(`
text-14px text-gray-shade-7 font-semibold
`);
const balanceNumber = ctl(`
text-14px font-semibold text-white
`);
const maxBtnContainer = ctl(`
detail bg-background-shade-3 absolute top-[50%] translate-y-[-50%] right-0 w-full max-w-[95px] lg:max-w-[115px] h-full flex items-center justify-center
`);
const maxBtn = ctl(`
cursor-pointer text-14px text-yellow-theme font-medium border-2 border-gray-shade-3 bg-gray-shade-9 rounded-2xl px-3 py-1 transition hover:bg-yellow-theme hover:text-black-shade-3 hover:border-0
`);
const conversionBtn = ctl(`
cursor-pointer conversionBtn w-[70px] h-[70px] xl:w-[100px] xl:h-[100px]  bg-gray-shade-9 border-2 border-gray-shade-3 flex items-center justify-center transition hover:scale-110 rounded-full
`);
const conversionBoxFooter = ctl(`
pt-8 lg:pt-12 w-full lg:max-w-[428px] mx-auto text-center
`);
const conversionBoxFooterTitle = ctl(`
text-14px font-semibold text-gray-shade-7 pb-4
`);
const conversionBoxFooterTitleBold = ctl(`
text-white
`);
