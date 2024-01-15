import React from "react";
import { useRouter } from "next/router";
import { BsArrowLeftShort } from "react-icons/bs";
import cn from "@/utils/cn";

type BackButtonProps = {
  className?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const router = useRouter();

  return (
    <button
      onClick={router.back}
      className={cn(
        "flex h-[55px] w-[60px] flex-shrink-0 items-center justify-center bg-[url(/images/clip-path.png)] bg-cover bg-center bg-no-repeat",
        className
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
        <BsArrowLeftShort className="h-6 w-6 fill-white" />
      </span>
    </button>
  );
};
