// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

export const PresaleCard = () => {
  return (
    <div className={presaleCardContainer}>
      <div className={timerContentContainer}>
        <div>
          <h1 className={timerTitle}>
            The time remaining to <br className="hidden lg:block" /> participate
            in Presale Round 1
          </h1>
          <div className={timerSubTitleContainer}>
            <h2 className={timerSubTitle}>
              [1° Round ] Join in to this round to jet a{" "}
              <span className={timerSubTitleBold}>60% Token Bonus</span>
            </h2>
          </div>
        </div>
        {/* didn't convert it to ctl yet because still animation will be applied */}
        <div className="timer flex items-center gap-8">
          <div className="box flex flex-col gap-2 items-center ">
            <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              <h1 className="text-black-shade-3 font-semibold text-34px">41</h1>
            </div>
            <p className="text-14px font-semibold text-gray-shade-7 ">Days</p>
          </div>
          <div className="box flex flex-col gap-2 items-center ">
            <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              <h1 className="text-black-shade-3 font-semibold text-34px">37</h1>
            </div>
            <p className="text-14px font-semibold text-gray-shade-7 ">Hours</p>
          </div>
          <div className="box flex flex-col gap-2 items-center ">
            <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              <h1 className="text-black-shade-3 font-semibold text-34px">18</h1>
            </div>
            <p className="text-14px font-semibold text-gray-shade-7 ">
              Minutes
            </p>
          </div>
          <div className="box flex flex-col gap-2 items-center ">
            <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              <h1 className="text-black-shade-3 font-semibold text-34px">52</h1>
            </div>
            <p className="text-14px font-semibold text-gray-shade-7 ">
              Seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// styling
const presaleCardContainer = ctl(`
bg-no-repeat bg-top bg-buydao-pattern rounded-2xl bg-background-shade-1 p-8 lg:p-14 bg-cover
`);
const timerContentContainer = ctl(`
content flex flex-col lg:flex-row items-center justify-between gap-8
`);
const timerTitle = ctl(`
text-24px text-white font-semibold pb-2.5
`);
const timerSubTitleContainer = ctl(`
blurbackground rounded-xl bg-white/30 backdrop-blur-sm py-1 px-2.5 border border-solid border-white/20
`);
const timerSubTitle = ctl(`
text-14px text-[#F6F7FA]
`);
const timerSubTitleBold = ctl(`
text-white font-semibold
`);
