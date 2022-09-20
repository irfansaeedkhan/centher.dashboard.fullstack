// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { WalletIcon } from "@/assets/svgs";

export const RegisterationFees: React.FC = () => {
  return (
    <form className={wrapper}>
      <div className={fieldWrapper}>
        <WalletIcon />
      </div>
      <div className={fieldTitle}>Pay Registeration Fee</div>
      <div className={text}>
        Invalid Sponsor or Sponsor not provided. Please pay{" "}
        <span className="text-brand-primary">0.33929123268872 BNB</span> for
        registeration.
      </div>
      <div>
        <button className={button}>Pay fee</button>
      </div>
    </form>
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
  dynamicTranss
  text-gray-shade-5 
  justify-center 
  bg-brand-primary 
`);
