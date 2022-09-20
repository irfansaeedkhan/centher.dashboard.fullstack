// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { WalletIcon } from "@/assets/svgs";

export const RegisterationFees: React.FC = () => {
  return (
    <div className={wrapper}>
      <div className={fieldWrapper}>
        <WalletIcon />
      </div>
      <h3 className={fieldTitle}>Pay Registeration Fee</h3>
      <p className={text}>
        Please pay registeration fee to start using your account.
      </p>
      <div className="mt-8">
        <p className="text-brand-primary text-center font-semibold tracking-wider text-base">
          0.33929123268872 BNB
        </p>
        <button className={button}>Pay fee</button>
      </div>
    </div>
  );
};

// Styles
const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-lg
  text-white
  font-semibold 
`);

const text = ctl(`
  text-sm 
  text-gray-shade-4
`);

const button = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  text-gray-shade-5 
  justify-center 
  bg-brand-primary
  hover:bg-brand-primary-dark
  transition-all 
`);
