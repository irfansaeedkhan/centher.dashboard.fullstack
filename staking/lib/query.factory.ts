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
  GET_PROJECTS: `query MyQuery($skip: Int , $first: Int ) {
    pools(where: {showOnCenther: true, isActive : true}, skip: $skip, first: $first) {
      annualStakingRewardRate
      cancellationFees
      claimDuration
      createdAt
      firstRewardDuration
      id
      isActive
      isLP
      isUnstakable
      levelFive
      levelFour
      levelOne
      levelSix
      levelThree
      levelTwo
      maxStakableAmount
      maxStakeAmount
      metadataUri
      minStakeAmount
      name
      nonRefundable
      poolOwner
      rate
      rewardModeForRef
      rewardToken
      showOnCenther
      stakeToken
      stakingDurationPeriod
      startTime
      tax
      totalPaidReward
      totalRestakedAmount
      totalStakedAmount
    }
  }`,
  GET_PROJECT: `query MyQuery($id: ID = "", $user: String = "") {
  pools(where: {id: $id, showOnCenther: true}) {
    annualStakingRewardRate
    cancellationFees
    claimDuration
    createdAt
    firstRewardDuration
    id
    isActive
    isLP
    isUnstakable
    levelFive
    levelFour
    levelOne
    levelSix
    levelThree
    levelTwo
    maxStakableAmount
    maxStakeAmount
    metadataUri
    minStakeAmount
    name
    nonRefundable
    poolOwner
    rate
    rewardModeForRef
    rewardToken
    showOnCenther
    stakeToken
    stakingDurationPeriod
    startTime
    tax
    totalPaidReward
    totalRestakedAmount
    totalStakedAmount
    users(where: {referrer: $user}) {
      joinedAt
      id
      transfers {
        user
        type
        txId
        paidFee
        id
        endAt
        createdAt
        amount
        unstake {
          txId
          id
          createdAt
          amount
        }
      }
    }
    transfers(where: {user: $user}) {
      user
      type
      txId
      projectId
      paidFee
      id
      endAt
      createdAt
      amount
      unstake {
        user
        txId
        projectId
        id
        createdAt
        amount
      }
    }
    rewards(where: {user: $user}) {
      type
      txId
      startDuration
      referral
      projectId
      paidTax
      id
      endDuration
      destination
      createdAt
      amount
      level
    }
  }
}`,
  GET_USER_REFERRALS: `query MyQuery($pool: String = "", $referrer: Bytes = "") {
  users(where: {pool: $pool, referrer: $referrer}) {
    joinedAt
    referrer
    user
    id
  }
}`,
};
