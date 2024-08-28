import { useEffect, useState } from "react";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { OldMarketplaceCollectionBlackList } from "@/web3/blockchain/helpers/blacklist.helper";
import { getCollectionListOfSingleCreator } from "@/lib/get-collection-list-of-single-creator";

const ProductNativeCollection = {
  id: AddressFactory.getContractAddress(SmartContractName.NATIVE_COLLECTION),
  name: "CENTHER Native NFT",
  collection: AddressFactory.getContractAddress(
    SmartContractName.NATIVE_COLLECTION
  ),
};

export interface IMyCollection {
  id: string;
  name: string;
  collection: string;
}

export const useGetMyCollections = (account: string | null | undefined) => {
  const [collections, setCollections] = useState<IMyCollection[]>([
    ProductNativeCollection,
  ]);

  useEffect(() => {
    if (account) {
      getCollectionListOfSingleCreator({
        creator_address: account,
        limit: 50,
        skip: 0,
      }).then((result) => {
        setCollections(
          [ProductNativeCollection]
            .concat(
              result.map((item) => ({
                id: item.id,
                name: item.name,
                collection: item.collection,
              }))
            )
            .filter(
              (e) => !OldMarketplaceCollectionBlackList.isBlocked(e.collection)
            )
        );
      });
    }
  }, [account]);

  return collections;
};
