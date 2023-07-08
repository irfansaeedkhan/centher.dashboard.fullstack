import React from "react";
import { ListCardDataOBj } from "./list-card-data";
import clsx from "clsx";

interface ListCardProps {
  card: ListCardDataOBj;
}

const ListCard: React.FC<ListCardProps> = ({ card }) => {
  return (
    <div className="flex h-[682px] w-full max-w-[552px] flex-col gap-5 rounded-2xl bg-elevation-1 p-8">
      <div className="flex w-full items-center justify-between">
        <div>
          <p className={label}>Staking Name</p>
          <p className={value}>DeXa {card.pack}</p>
        </div>
        <p className="textGradient text-xs font-medium">View project detail</p>
      </div>
      <div>
        <p className={label}>Token Address</p>
        <p className={clsx(value, "truncate")}>{card.token_address}</p>
      </div>
      <div></div>
    </div>
  );
};

export default ListCard;

const label = `text-sm text-gray-shade-14`;
const value = `text-sm font-medium text-white mt-[2px]`;
