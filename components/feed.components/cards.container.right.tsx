import React, { useEffect, useState } from "react";

import { SuggestedCard } from "./suggested.card";
import { PromotionCard3 } from "./promotion.cards/card-3";
import { PromotionCard6 } from "./promotion.cards/card-6";
import { PromotionCard8 } from "./promotion.cards";
import { VoiSpaceFeedCard } from "../voispace/voispace.feed.card";

export const CardsContainerRight = () => {
  const [is2XLScreen, setIs2XLScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIs2XLScreen(window.innerWidth >= 1440);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={`hidden space-y-3 f2xl:block`}>
      <VoiSpaceFeedCard isRendered={is2XLScreen} />
      <SuggestedCard />
      <PromotionCard6 />
      <PromotionCard3 />
      <PromotionCard8 className="sticky top-[84px]" />
    </div>
  );
};
