import React from "react";

import { SuggestedCard } from "./suggested.card";
import { PromotionCard3 } from "./promotion.cards/card-3";
import { PromotionCard6 } from "./promotion.cards/card-6";

export const CardsContainerRight = () => {
  return (
    <div className={`hidden space-y-3 f2xl:block`}>
      <SuggestedCard />
      <PromotionCard6 />
      <PromotionCard3 className="sticky top-[84px]" />
    </div>
  );
};
