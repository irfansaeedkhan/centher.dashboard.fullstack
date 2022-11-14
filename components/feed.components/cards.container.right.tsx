import React from "react";

import { MessagesCard } from "./messages.card";

export const CardsContainerRight = () => {
  return (
    <div className={`hidden f2xl:block space-y-3`}>
      <MessagesCard className="sticky top-[84px]" />
    </div>
  );
};
