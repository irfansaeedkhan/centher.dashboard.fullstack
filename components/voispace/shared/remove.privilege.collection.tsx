import React from "react";
import Image from "next/image";

import Button from "@/components/button";
import { CFSCollection } from "@/models/nft";

export const RemovePrivilegeCollection: React.FC<{
  collection: CFSCollection;
  onRemoveClick: (collection: CFSCollection) => void;
}> = ({ onRemoveClick, collection }) => {
  return (
    <div
      key={collection.collection}
      className="flex cursor-pointer items-center gap-x-3 p-4"
    >
      <Image
        src={collection.ipfs_metadata.profileIPFSHash}
        alt={collection.collection}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full"
      />
      <div className="flex-grow">
        <p className="word-break text-sm font-medium text-white">
          {collection.collection}
        </p>
      </div>
      <Button
        onClick={() => onRemoveClick(collection)}
        title="Remove"
        variant="danger"
        className="text-xs font-medium"
      />
    </div>
  );
};
