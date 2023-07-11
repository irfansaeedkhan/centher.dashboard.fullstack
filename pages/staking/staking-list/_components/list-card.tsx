import React from "react";
import { ListCardDataOBj } from "./list-card-data";
import clsx from "clsx";

interface ListCardProps {
  card: ListCardDataOBj;
}

const ListCard: React.FC<ListCardProps> = ({ card }) => {
  return (
    <div className="flex w-full max-w-[552px] flex-grow flex-col gap-5 rounded-2xl bg-elevation-1 p-8">
      <div className="flex w-full items-center justify-between">
        <div>
          <p className={label}>Staking Name</p>
          <p className={value}>DeXa {card.pack}</p>
        </div>
        <p className="textGradient text-xs font-medium">View project detail</p>
      </div>
      <div>
        <p className={label}>Token Address</p>
        <p className={clsx(value, "truncate")}>{card.token_address}</p>
      </div>
      {card.rewards_level && (
        <div className="rounded-xl border border-gray-shade-3 p-4">
          <p className={label}>Multilevel Rewards System</p>
          <div className="scrollSetLight2 flex items-center gap-2 overflow-x-auto">
            {card.rewards_level.map((level, index) => (
              <div className="flex min-w-[80px] items-center gap-1" key={index}>
                <p className="text-xs font-medium text-gray-shade-14">
                  Level {level.level}:
                </p>
                <p
                  className={clsx(
                    "text-sm font-medium",
                    level.percent === 0 ? "text-gray-shade-14" : "text-white"
                  )}
                >
                  {level.percent}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex w-full flex-wrap gap-10">
        <div className={section}>
          <p className={label}>APY</p>
          <p className={value}>{card.apy}</p>
        </div>
        <div className={section}>
          <p className={label}>Staking Period</p>
          <p className={value}>{card.staking_period}</p>
        </div>
        <div className={section}>
          <p className={label}>Claim Period</p>
          <p className={value}>{card.claim_period}</p>
        </div>
        {card.liquidity_pool_provided === "yes" && (
          <div className={section}>
            <p className={label}>Liquidity Pool Provided</p>
            <p className={value2}>{card.liquidity_pool_provided}</p>
          </div>
        )}
        {card.is_cancelable === "yes" && (
          <div className={section}>
            <p className={label}>Is Cancelable</p>
            <p className={value2}>{card.is_cancelable}</p>
          </div>
        )}
        {card.show_on_centher === "yes" && (
          <div className={section}>
            <p className={label}>Show on Centher</p>
            <p className={value2}>{card.show_on_centher}</p>
          </div>
        )}
        <div className={section}>
          <p className={label}>Charge Fee on Cancel</p>
          <p className={value}>{card.charge_fee_on_cancel}</p>
        </div>
        <div className={section}>
          <p className={label}>Start Time</p>
          <p className={value}>{card.start_time}</p>
        </div>
        <div className={section}>
          <p className={label}>Maximum Stakable Amount</p>
          <p className={value}>{card.max_staking_amount}</p>
        </div>
        <div className={section}>
          <p className={label}>Minimum Stakable Amount</p>
          <p className={value}>{card.min_staking_amount}</p>
        </div>
      </div>
      {card.project_metadata && (
        <div>
          <p className={label}>Project Metadata</p>
          <div className="flex w-full flex-wrap items-center gap-5">
            {card.project_metadata.map((data, index) => (
              <div
                className="gradient-border-3 mt-[6px] flex h-[72px] w-full max-w-[158px] flex-col items-center justify-center rounded-[10px] p-[1px]"
                key={index}
              >
                <p className="textGradient text-xs font-medium">{data.title}</p>
                <p className={value}>{data.data}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCard;

const label = `text-sm text-gray-shade-14 mb-[2px]`;
const value = `text-sm font-medium text-white`;
const value2 = `text-sm font-medium text-green-shade-1`;
const section = `w-[45%]`;
