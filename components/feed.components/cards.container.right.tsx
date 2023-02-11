import React from "react";

import { MessagesCard } from "./messages.card";

export const CardsContainerRight = () => {
  return (
    <div className={`hidden space-y-3 f2xl:block`}>
      <MessagesCard className="sticky top-[84px]" />
    </div>
  );
};
