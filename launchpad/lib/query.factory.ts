import { DocumentNode, gql } from "@apollo/client";
import { QueryNames } from "../enum/query.name.enum";
import { Queries } from "../types/queries";

export class QueryFactory {
  static getQuery(name: QueryNames): DocumentNode {
    const query = queries[name];
    if (!query) {
      throw new Error(`query ${name} not found`);
    }

    return gql(query);
  }
}

const queries: Queries = {
  GET_PRESALES: `query MyQuery{
    presales{
      id
      token
      creator
      owner
      fundType
      minTokensToSell
      maxTokensToSell
      isRefSupport
      levelOne
      levelTwo
      levelThree
      levelFour
      levelFive
      levelSix
      coinFeeRate
      tokenFeeRate
      releaseMonth
      refundAmount
      metadata
      isActive
      totalPurchasesInBuyingToken
      roundDeep
      roundInfos {token, startTime, endTime, lockMonths, minContribution, maxContribution, tokensToSell, pricePerToken}
      tokenPurchaseWithBNB {token,beneficiary, amount, amountForOwner, round, transactionHash, blockTimestamp}
      tokenPurchaseWithBUSD {token, beneficiary, amount, amountForOwner, round, transactionHash, blockTimestamp}
      tokenClaim {token, beneficiary, tokenAmount}
      refRewardClaim {token, referrer, amount}
    }
}
  `,
  GET_PRESALE: `query MyQuery($token: Bytes = ""){
    presales(where: {token: $token}){
      id
      token
      creator
      owner
      fundType
      minTokensToSell
      maxTokensToSell
      isRefSupport
      levelOne
      levelTwo
      levelThree
      levelFour
      levelFive
      levelSix
      coinFeeRate
      tokenFeeRate
      releaseMonth
      refundAmount
      metadata
      isActive
      totalPurchasesInBuyingToken
      roundDeep
      roundInfos {token, startTime, endTime, lockMonths, minContribution, maxContribution, tokensToSell, pricePerToken}
      tokenPurchaseWithBNB {token,beneficiary, amount, amountForOwner, round, transactionHash, blockTimestamp}
      tokenPurchaseWithBUSD {token, beneficiary, amount, amountForOwner, round, transactionHash, blockTimestamp}
      tokenClaim {token, beneficiary, tokenAmount}
      refRewardClaim {token, referrer, amount}
    }
}
  `,
};
