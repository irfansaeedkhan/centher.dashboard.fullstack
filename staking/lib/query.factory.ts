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
      totalStakedAmount
      totalPaidReward
      startTime
      stakingDurationPeriod
      stakeToken
      showOnCenther
      rewardToken
      rate
      rewardModeForRef
      poolOwner
      name
      minStakeAmount
      metadataUri
      maxStakableAmount
      maxStakeAmount
      levelTwo
      levelThree
      levelSix
      levelOne
      levelFour
      levelFive
      isUnstakable
      isLP
      isActive
      id
      firstRewardDuration
      claimDuration
      createdAt
      cancellationFees
      annualStakingRewardRate
    }
  }`,
  GET_PROJECT: `query MyQuery($id: ID = "") {
    pools(where: {id: $id, showOnCenther: true}) {
      totalStakedAmount
      totalPaidReward
      startTime
      stakingDurationPeriod
      stakeToken
      showOnCenther
      rewardToken
      rate
      rewardModeForRef
      poolOwner
      name
      minStakeAmount
      metadataUri
      maxStakableAmount
      maxStakeAmount
      levelTwo
      levelThree
      levelSix
      levelOne
      levelFour
      levelFive
      isUnstakable
      isLP
      isActive
      id
      firstRewardDuration
      claimDuration
      createdAt
      cancellationFees
      annualStakingRewardRate
      transfers {
        endAt
        createdAt
        type
        user
      }
      users {
        referrer
        joinedAt
        id
      }
    }
  }`,
  GET_USER_TRANSFERS_BY_POOL: `query MyQuery($user: Bytes = "", $projectId: BigInt = "") {
    transfers(where: {user: $user, projectId: $projectId}) {
      user
      type
      txId
      projectId
      paidFee
      id
      endAt
      createdAt
      amount
    }
  }`,
  GET_USER_CLAIMED_REWARDS: `query MyQuery($poolId: BigInt = "", $user: Bytes = "", $first: Int = 10, $skip: Int = 10) {
    rewardClaimeds(
      where: {poolId: $poolId, user: $user, isRef: false}
      first: $first
      skip: $skip
      orderDirection: desc
      orderBy: blockNumber
    ) {
      user
      transactionHash
      poolId
      id
      blockTimestamp
      blockNumber
      amount
    }
  }`,
  GET_USER_CLAIMED_REF_REWARDS: `query MyQuery($first1: Int = 1000, $skip1: Int = 0, $projectId: BigInt = "", $user: Bytes = "") {
    rewards(
      where: {projectId: $projectId, user: $user, isRef: true}
      first: $first1
      skip: $skip1
    ) {
      user
      type
      txId
      startDuration
      referral
      projectId
      isRef
      id
      endDuration
      createdAt
      amount
    }
  }`,
  GET_USER_REFERRALS: `query MyQuery($referrer: Bytes = "", $pool: BigInt = "") {
    users(where: {referrer: $referrer, pool: $pool}) {
      referrer
      joinedAt
      id
      pool
    }
  }`,
};
