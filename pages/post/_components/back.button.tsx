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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    router.back();
  };

  return (
    <button
      className={clsx(
        `w-fit rounded-full bg-brand-primary/10 px-4 py-2 text-[11px] font-medium text-brand-primary transition hover:bg-brand-primary hover:text-black-shade-2`,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      Back
    </button>
  );
};
