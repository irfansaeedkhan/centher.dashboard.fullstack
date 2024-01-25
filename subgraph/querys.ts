export const genealogyQuery = `
query MyQuery($referrer_in:[Bytes!]){
  users(
    where: {referrer_in:$referrer_in }
    first: 1000
  ) {
    referrer
    publicKey
    generatedNTR
    generatedBUSD
    generatedBNB
    createdAt
    createNFTCount
    createCollectionCount
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
      where: {amount_gt:"0", referrer: $referrer}
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
      txId
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
    presalePurchaseWithBusdHistories(skip: $skip, first: $first, orderBy: createdAt, orderDirection: desc) {
      roundIndex
      publicKey
      createdAt
      busdAmountForOwner
      busdAmount
      txId
    }
  }
`;

export const purchaseWithNtrHistory = `
  query MyQuery($first: Int!, $skip: Int!) {
    presalePurchaseWithNtrHistories(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      roundIndex
      publicKey
      ntrAmountForOwner
      ntrAmount
      createdAt
      txId
    }
  }
`;

export const allPurchasesHistoryByUser = `
query MyQuery($first: Int!, $skip: Int!, $publicKey: Bytes = "") {
  presalePurchaseWithBusdHistories(skip: $skip, first: $first, where: {publicKey: $publicKey}) {
    roundIndex
    publicKey
    createdAt
    busdAmountForOwner
    busdAmount
    txId
  }
  presalePurchaseWithNtrHistories(first: $first, skip: $skip, where: {publicKey: $publicKey}) {
    roundIndex
    publicKey
    ntrAmountForOwner
    ntrAmount
    createdAt
    txId
  }
}
`;

export const purchaseWithBusdHistoryByUser = `
  query MyQuery($first: Int!, $skip: Int!, $publicKey: Bytes = "") {
    presalePurchaseWithBusdHistories(skip: $skip, first: $first, where: {publicKey: $publicKey}) {
      roundIndex
      publicKey
      createdAt
      busdAmountForOwner
      busdAmount
      txId
    }
  }
`;

export const purchaseWithNtrHistoryByUser = `
  query MyQuery($first: Int!, $skip: Int!, $publicKey: Bytes = "") {
    presalePurchaseWithNtrHistories(first: $first, skip: $skip, where: {publicKey: $publicKey}) {
      roundIndex
      publicKey
      ntrAmountForOwner
      ntrAmount
      createdAt
      txId
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

export const GET_COLLECTION_ADDITIONAL_INFO = `query MyQuery($collection: Bytes = "") {
  nfts(where: {collection: $collection}, first: 1000) {
    saleState
    price
  }
}
`;

export const GET_USER_TOTAL_SOLD_NFTS = `query MyQuery2($collection: Bytes = "", $seller: Bytes = "") {
  marketplaceSaleHistories(
    first: 1000
    where: {collection: $collection, buyer_not: "0x0000000000000000000000000000000000000000", seller: $seller, price_gt: "0"}
  ) {
    price
    type
  }
}`;

export const GET_USER_NFTS = `query MyQuery($collection: Bytes = "", $owner: Bytes = "") {
  nfts(where: {collection: $collection, owner: $owner}, first: 1000) {
  owner
  tokenId
  ipfs
  creator
  price
}
}`;
