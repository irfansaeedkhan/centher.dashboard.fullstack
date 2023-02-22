import clsx from "clsx";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export const NoPostMessage: React.FC<Props> = ({
  message,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `rounded-10px bg-background-shade-3 py-4 text-center font-medium text-white fsm:w-full flg:w-[544px]`,
        className
      )}
      {...props}
    >
      {message}
    </div>
  );
};
