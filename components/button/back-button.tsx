import React from "react";
import { useRouter } from "next/router";
import cn from "@/utils/cn";
import { AppRoutes } from "@/constants/app.routes";
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

  const handleBack = () => {
    // Post-grill Q20: this button sits on the share-target pages
    // (post detail), where a large share of landings are cold — no
    // in-app history. router.back() there ejects the visitor out of
    // the app entirely; fall back to the feed instead.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(AppRoutes.feed.index);
    }
  };

  return (
    <button onClick={handleBack} className={cn(className)}>
      <BackButtonAnimated className={cn(svgClassName)} />
    </button>
  );
};
