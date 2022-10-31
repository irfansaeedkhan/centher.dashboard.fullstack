export const hotNFTsQuery = `
  query($first: Int!, $skip: Int!) {
    nfts(orderBy: tradingVolumn, first: $first, skip: $skip) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      listInfo {
        price
        bidSize
      }
      auctionInfo {
        endTime
        highestBidPrice
        highestBidAddress
        bidSize
        startPrice
      }
    }
  }
`;

export const collectionsQuery = `
  query($first: Int!, $skip: Int!) {
    collections(orderBy: tradingVolumn, first: $first, skip: $skip) {
      collection
      creator
      id
      ipfs
      maxSupply
      name
      symbol
      totalSupply
      txTime
    }
  }
`;

export const allNFTsQuery = `
  query($first: Int!, $skip: Int!) {
    nfts(first: $first, skip: $skip) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      listInfo {
        price
        bidSize
      }
      auctionInfo {
        endTime
        highestBidPrice
        highestBidAddress
        bidSize
        startPrice
      }
    }
  }
`;

export const nftQuery = `
  query($collection: Bytes!, $tokenId: Int!) {
    nfts(where: {collection: $collection, tokenId: $tokenId}) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      mintHash
      tokenId
      price
      auctionInfo {
        bidSize
        endTime
        highestBidAddress
        highestBidPrice
        startPrice
        bids {
          bidder
          price
          txTime
        }
      }
      listInfo {
        bidSize
        price
        bids {
          bidder
          price
          txTime
        }
      }
    }
  }
`;

export const saleQuery = `
  query($collection: Bytes!, $tokenId: Int!) {
    marketplaceSaleHistories(where: {collection: $collection, tokenId: $tokenId}) {
      type
      txTime
      seller
      price
      buyer
    }
  }
`;

export const collectionQuery = `
  query($collection: Bytes!) {
    collections(where: {collection: $collection}) {
      txTime
      tradingVolumn
      totalSupply
      symbol
      name
      maxSupply
      ipfs
      creator
      createHash
      collection
    }
  }
`;

export const nftsQuery = `
  query($collection: Bytes!, $orderDirection: String, $skip: Int!, $first: Int!) {
    nfts(orderBy: price, orderDirection: $orderDirection, where: {collection: $collection}, first: $first, skip: $skip) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      listInfo {
        price
        bidSize
      }
      auctionInfo {
        endTime
        highestBidPrice
        highestBidAddress
        bidSize
        startPrice
      }
    }
  }
`;

export const nftsBySaleStateQuery = `
  query($collection: Bytes!, $orderDirection: String, $skip: Int!, $first: Int!, $saleState: String) {
    nfts(orderBy: price, orderDirection: $orderDirection, where: {collection: $collection, saleState: $saleState}, first: $first, skip: $skip) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      listInfo {
        price
        bidSize
      }
      auctionInfo {
        endTime
        highestBidPrice
        highestBidAddress
        bidSize
        startPrice
      }
    }
  }
`;
