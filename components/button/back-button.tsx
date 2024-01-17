import React from "react";
import { useRouter } from "next/router";
import cn from "@/utils/cn";
import { BackButtonAnimated } from "@/assets/svgs";

type BackButtonProps = {
  className?: string;
  svgClassName?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({
  className,
  svgClassName,
}) => {
  const router = useRouter();

  return (
    <button onClick={router.back} className={cn(className)}>
      <BackButtonAnimated
        className={cn(
          "transform opacity-60 duration-[800ms] ease-in-out hover:opacity-100",
          svgClassName
        )}
      />
    </button>
  );
};
