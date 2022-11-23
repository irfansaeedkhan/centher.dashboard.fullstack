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
        `fsm:w-full flg:w-[544px] py-4 rounded-10px bg-background-shade-3 text-white text-center font-medium`,
        className
      )}
      {...props}
    >
      {message}
    </div>
  );
};
