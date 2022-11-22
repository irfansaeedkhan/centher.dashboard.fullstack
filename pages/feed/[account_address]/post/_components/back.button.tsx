import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export const BackButton: React.FC<Props> = ({
  className,
  onClick,
  ...props
}) => {
  const router = useRouter();

  return (
    <button
      className={clsx(
        `text-brand-primary text-[11px] px-4 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-fit`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        router.back();
      }}
      {...props}
    >
      Back
    </button>
  );
};
