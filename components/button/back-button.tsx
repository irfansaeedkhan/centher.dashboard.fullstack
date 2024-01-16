import React from "react";
import { useRouter } from "next/router";
import cn from "@/utils/cn";
import { BackButtonAnimated } from "@/assets/svgs";

type BackButtonProps = {
  className?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const router = useRouter();

  return (
    <button onClick={router.back} className={cn(className)}>
      <BackButtonAnimated className="transform opacity-60 duration-[800ms] ease-in-out hover:opacity-100" />
    </button>
  );
};
