import React from "react";
import Image from "next/image";

import { SearchResultWithType } from "@/lib/search";
import { CFSCollection } from "@/models/nft";
import { Collection } from "@/hooks/stream/types";

interface Props {
  collection: Collection;
  onAddClick: (collection: Collection) => void;
}

export const SearchedPrivilegeCollection: React.FC<Props> = ({
  onAddClick,
  collection,
}) => {
  return (
    <div
      key={collection.collection}
      className="flex cursor-pointer items-center gap-x-3 rounded-xl bg-black-shade-1 p-4 hover:bg-black-shade-2"
    >
      {/* <Image
        src={collection.name}
        alt={collection.collection}
        width={40}
        height={40}
        className="h-8 w-8 shrink-0 rounded-full"
      /> */}
      <div className="flex-grow">
        <p className="word-break text-sm font-medium text-white">
          {collection.collection}
        </p>
      </div>
      <button
        onClick={() => onAddClick(collection)}
        className={`gradient-borders-2 h-8 w-28 rounded-10px p-[1px] text-xs font-medium`}
      >
        <span className={`text-gradient-1`}>Add address</span>
      </button>
    </div>
  );
};
