import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { NFT } from "@/models/nft";
import { hotNFTsQuery } from "@/subgraph/querys";
import { SUBGRAPH_URL } from "@/web3/constants/common";
import { AppError } from "@/utils/app-error";

const MAX_HOT_NFTS = 15;

export const getHotNFTs = async (): Promise<NFT[]> => {
  try {
    const client = new ApolloClient({
      uri: SUBGRAPH_URL,
      cache: new InMemoryCache(),
    });

    let _hotNFTs: NFT[] = [];

    const { data: result, error } = await client.query({
      query: gql(hotNFTsQuery),
      variables: {
        first: MAX_HOT_NFTS,
        skip: 0,
      },
      fetchPolicy: "cache-first",
    });

    if (result && !error) {
      _hotNFTs = result.nfts.map((item: any): NFT => {
        let _endTime = 0;
        if (item.saleState === "Auction") {
          _endTime = item.auctionInfo.endTime;
        }
        return {
          id: item.id,
          collection: item.collection,
          tokenId: item.tokenId,
          creator: item.creator,
          createTime: item.createTime,
          ipfs: item.ipfs,
          saleState: item.saleState,
          price: item.price,
          owner: item.owner,
          endTime: _endTime,
        };
      });
      return _hotNFTs;
    } else {
      throw error;
    }
  } catch (error: any) {
    throw new AppError(error, "Can not load Hot NFTs", "getHotNFTs");
  }
};
