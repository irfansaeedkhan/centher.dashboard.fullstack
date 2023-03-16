import { BlockchainRead } from "@/web3/blockchain";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { useEffect, useState } from "react";

const CentherNativeCollection = {
  id: "1",
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
    CentherNativeCollection,
  ]);

  useEffect(() => {
    const fetchMyCollections = async (account: string) => {
      const result = await BlockchainRead.getAccountCollections(account);
      if (result?.length) {
        const _collections = result.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            collection: item.collection,
          };
        });
        setCollections([CentherNativeCollection, ..._collections]);
      }
    };

    if (account) {
      fetchMyCollections(account);
    }
  }, [account]);
  return collections;
};
