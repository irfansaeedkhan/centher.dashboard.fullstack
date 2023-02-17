import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { NFT } from "@/models/nft";
import { SUBGRAPH_URL } from "@/web3/constants/common";
import { AppError } from "@/utils/app-error";

const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

export const getNFTs = async ({
  query,
  limit = 15,
  skip = 0,
}: {
  query: string;
  limit?: number;
  skip?: number;
}): Promise<NFT[]> => {
  try {
    let nfts: NFT[] = [];

    const { data: result, error } = await client.query({
      query: gql(query),
      variables: {
        first: limit,
        skip: skip,
      },
      fetchPolicy: "cache-first",
    });

    if (result && !error) {
      nfts = result.nfts.map((item: any): NFT => {
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
      return nfts;
    } else {
      throw error;
    }
  } catch (error: any) {
    throw new AppError(error, "Can not load NFTs", "getNFTs");
  }
};
