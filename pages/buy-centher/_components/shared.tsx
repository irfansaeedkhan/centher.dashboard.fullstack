import clsx from "clsx";

export const inputBox = clsx(
  `inputBox flex relative h-[64px] bg-gray-shade-9 border-2 border-gray-shade-3 rounded-2xl`
);

export const inputBoxLeft = clsx(
  `inputBoxLeft flex items-center flex-grow px-3`
);

export const inputBoxRight = clsx(
  `inputBoxRight flex items-center flex-grow bg-background-shade-3 px-4 w-full max-w-[95px] flg:max-w-[115px] rounded-r-2xl`
);

export const truncateTokenAmount = (tokenAmount: number, threshold: number) => {
  return tokenAmount < threshold &&
    tokenAmount.toString().length < threshold.toString().length
    ? tokenAmount
    : tokenAmount.toString().slice(0, threshold.toString().length) + "+";
};
