import clsx from "clsx";
import React from "react";
import { RoundCardProps } from "../shared-types";

export const RoundCard: React.FC<RoundCardProps> = ({
  round,
  title,
  description,
  round_no,
  current_round,
}) => {
  return (
    <div className="col-span-1 h-auto min-h-[174px] max-w-full rounded-xl bg-black-shade-9 p-5 fmd:max-w-[263px]">
      <div className="flex items-center gap-4">
        <span
          className={clsx(
            "flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            round === current_round
              ? "background-gradient-color text-black"
              : "bg-elevation-3 text-gray-shade-14"
          )}
        >
          {round_no}
        </span>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <div className="mt-3">
        <p className="text-[13px] leading-[21px] text-gray-shade-14">
          {description}
        </p>
      </div>
    </div>
  );
};
