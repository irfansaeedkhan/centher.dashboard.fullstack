export const hotNFTsQuery = `
  query($first: Int!, $skip: Int!) {
    nfts(orderBy: tradingVolumn, orderDirection: desc, first: $first, skip: $skip) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      owner
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
    collections(orderBy: tradingVolumn, orderDirection: desc, first: $first, skip: $skip) {
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

export const collectionsByCategoryQuery = `
  query($first: Int!, $skip: Int!, $category: String!) {
    collections(orderBy: tradingVolumn, orderDirection: desc, first: $first, skip: $skip, 
      where: {category: $category}) {
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
  query($first: Int!, $skip: Int!, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) {
    nfts(first: $first, 
        skip: $skip, 
        orderBy: $orderBy,
        orderDirection: $orderDirection ) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      owner
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

export const allNFTsByFilterQuery = `
  query($first: Int!, $skip: Int!, $category: String!, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) {
    nfts(first: $first, skip: $skip, 
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      where: {category: $category}) {
      collection
      createTime
      creator
      id
      ipfs
      saleState
      tokenId
      price
      owner
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
      owner
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
      owner
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
      owner
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

export const collectionsByAccount = `
  query($creator: Bytes!) {
    collections(
      orderBy: tradingVolumn
      orderDirection: desc
      where: {creator: $creator}
    ) {
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

export const listedNFTsByAccount = `
  query($first: Int!, $skip: Int!, $owner: Bytes!) {
    nfts(
      first: $first
      skip: $skip
      orderBy: tradingVolumn
      orderDirection: desc
      where: {owner: $owner}
    ) {
        collection
        createTime
        creator
        id
        ipfs
        saleState
        tokenId
        price
        owner
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

export const registeredCollections = `
  query {
    collections {
      collection
    }
  } 
`;

export const myCollections = `
  query MyQuery($creator: Bytes!) {
    collections(where: {creator: $creator}) {
      id
      name
      collection
    }
  }
`;

export const topCreators = `
  query($skip: Int!, $first: Int!) {
    users(orderBy: createNFTCount, orderDirection: desc, skip: $skip, first: $first) {
      createNFTCount
      createCollectionCount
      publicKey
    }
  }
`;

export const genealogyBaseDataQuery = `
  query MyQuery($publicKey: Bytes!) {
    users(where: {publicKey: $publicKey}) {
      userInfo {
        people
        earningNTRFromInICO
        earningFromInMarketplace
        earningBUSDFromInICO
      }
    }
  }
`;

export const referrerQuery = `
  query MyQuery($referrer: Bytes!) {
    users(where: {referrer: $referrer}) {
      userInfo {
        people
        earningNTRFromInICO
        earningFromInMarketplace
        earningBUSDFromInICO
      }
      publicKey
    }
  }
`;

export const genealogyQuery = `
  query MyQuery($referrer: Bytes) {
    genealogies(where: {referrer: $referrer}) {
      user {
        generatedBUSD
        generatedNTR
        publicKey
        people
        generatedBNB
      }
      createdAt
      level
    }
  }
`;

export const genealogyAtLevelQuery = `
  query MyQuery($level: Int, $referrer: Bytes) {
    genealogies(where: {level: $level, referrer: $referrer}) {
      user {
        generatedBUSD
        generatedNTR
        generatedBNB
        publicKey
        people
      }
      createdAt
      level
    }
  }
`;

export const referralRewardsInPresaleQuery = `
  query MyQuery($referrer: Bytes, $skip: Int, $first: Int) {
    presaleGenealogyHistories(
      where: {referrer: $referrer}
      orderDirection: desc
      orderBy: createdAt
      skip: $skip
      first: $first
    ) {
      user
      round
      referrer
      level
      isBusd
      id
      createdAt
      amount
    }
  }
`;

export const referrerClaimPresaleQuery = `
  query MyQuery($referrer: Bytes) {
    presaleGenalogyClaimHistories(
      where: {referrer: $referrer}
      orderDirection: desc
      orderBy: createdAt
    ) {
      isBusd
      createdAt
      amount
    }
  }
`;

export const purchaseWithBusdHistory = `
  query MyQuery($first: Int!, $skip: Int!) {
    presalePurchaseWithBusdHistories(skip: $skip, first: $first) {
      roundIndex
      publicKey
      createdAt
      busdAmountForOwner
      busdAmount
    }
  }
`;

export const purchaseWithNtrHistory = `
  query MyQuery($first: Int!, $skip: Int!) {
    presalePurchaseWithNtrHistories(first: $first, skip: $skip) {
      roundIndex
      publicKey
      ntrAmountForOwner
      ntrAmount
      createdAt
    }
  }
`;

export const claimCentherHistory = `
  query MyQuery($first: Int!, $skip: Int!) {
    presaleCentherClaimHistories(skip: $skip, first: $first) {
      roundIndex
      publicKey
      createdAt
      centherAmount
    }
  }
`;

export const registrationHistory = `
  query MyQuery {
    users(orderBy: createdAt, orderDirection: asc) {
      referrer
      publicKey
      createdAt
      paidAmountForRegistration
    }
  }
`;
