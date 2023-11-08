import clsx from "clsx";
import React from "react";

interface Props {
  round: number;
  title: string;
  description: string;
}

const RoundCard: React.FC<Props> = ({ round, title, description }) => {
  return (
    <div className="h-[174px] w-[263px] rounded-xl bg-black-shade-9 p-5">
      <div className="flex items-center gap-4">
        <span
          className={clsx(
            "flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            round === 1
              ? "background-gradient-color text-black"
              : "bg-elevation-3 text-gray-shade-14"
          )}
        >
          {round}
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

export default RoundCard;
