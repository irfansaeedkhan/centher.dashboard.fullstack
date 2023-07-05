import React from "react";
import clsx from "clsx";
import { CardsContainerLeft } from "@/components/feed.components";

interface AllPagesWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RecommendedPageWrapper: React.FC<AllPagesWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx("mx-auto w-full max-w-[1136px]", className)}
      {...props}
    >
      <div
        className={clsx(
          `grid grid-cols-[1fr_minmax(0,544px)_1fr] grid-rows-[auto_1fr] justify-center gap-4 flg:grid-cols-[1fr_minmax(0,272px)_minmax(0,544px)_1fr] flg:gap-6 f2xl:grid-cols-[minmax(0,272px)_minmax(0,544px)_minmax(0,272px)]`
        )}
      >
        <CardsContainerLeft className="flg:col-span-1 flg:col-start-2 f2xl:col-start-1" />

        <div
          className={clsx(
            `col-span-full fsm:col-span-1 fsm:col-start-2 flg:col-start-3 f2xl:col-span-2 f2xl:col-start-2`
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
