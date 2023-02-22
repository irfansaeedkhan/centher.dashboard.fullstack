import clsx from "clsx";
import React from "react";

import { AllPagesWrapper } from "../all.pages.wrapper";
import { CardsContainerLeft } from "./cards.container.left";
import { CardsContainerRight } from "./cards.container.right";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pageTitle?: string;
}

export const FeedPagesWrapper: React.FC<Props> = ({
  className,
  children,
  pageTitle = "Feed",
  ...props
}) => {
  return (
    <AllPagesWrapper pageTitle={pageTitle}>
      <div
        className={clsx(
          `mx-auto grid fsm:w-max fsm:grid-cols-[minmax(0,544px)] flg:grid-cols-[minmax(0,272px)_minmax(0,544px)] flg:gap-x-8 f2xl:grid-cols-[minmax(0,272px)_minmax(0,544px)_minmax(0,272px)] f2xl:gap-x-6`,
          className
        )}
        {...props}
      >
        <CardsContainerLeft />

        {children}

        <CardsContainerRight />
      </div>
    </AllPagesWrapper>
  );
};
