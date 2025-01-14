import React from "react";

import { SuggestedCard } from "./suggested.card";
import { PromotionCard3 } from "./promotion.cards/card-3";
import { PromotionCard6 } from "./promotion.cards/card-6";
import { PromotionCard8 } from "./promotion.cards";
import { VoiceSpaceFeedCard } from "../voispace/voispace.feed.card";

export const CardsContainerRight = () => {
  return (
    <div className={`hidden space-y-3 f2xl:block`}>
      <VoiceSpaceFeedCard />
      <SuggestedCard />
      <PromotionCard6 />
      <PromotionCard3 />
      <PromotionCard8 className="sticky top-[84px]" />
    </div>
  );
};
