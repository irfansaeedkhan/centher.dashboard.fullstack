import React from "react";

import { MessagesCard } from "./messages.card";
import { PromotionCard3 } from "./promotion.cards/card-3";

export const CardsContainerRight = () => {
  return (
    <div className={`hidden space-y-3 f2xl:block`}>
      <MessagesCard className="sticky top-[84px]" />
      <PromotionCard3 />
    </div>
  );
};
