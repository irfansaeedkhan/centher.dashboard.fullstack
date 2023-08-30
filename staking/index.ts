import { BigNumber } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { StakingUploader } from "@/utils/upload.tools/staking.metadata.uploader.utils";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { ZeroAddress } from "@/web3/constants/common";
import { eqAddress } from "@/live/utils/address.utils";
import { IApolloProvider } from "@/live/types/apollo.provider";
import { ICentherStakingConfig } from "./types/config.interface";
import {
  AddAffiliateSettingsInput,
  CreatePoolInput,
  CreatePoolMetadata,
  StakingFiles,
  ProgressCallback,
  MappedCreatePoolInput,
  OptionalType,
} from "./types";
import { setupCreatePoolData } from "./helpers/mappers.helper";
import { CreatePoolStepsEnum } from "./enum/create-pool-steps.enum";
import { CatchError } from "./decorators/catch-error.decorator";
import {
  CreatePoolCallContractError,
  CreatePoolCallStaticError,
  InsufficientFundError,
  InvalidAffiliateSystemSettings,
  WalletApprovalError,
} from "./errors/params.error";
import {
  GetStakingProjectInput,
  StakingProject,
} from "./types/get.projects.interface";
import { QueryFactory } from "./lib/query.factory";
import { QueryNames } from "./enum/query.name.enum";
import { getConnection } from "./lib/connection";
import {
  ClaimedRewards,
  GetClaimedRewardsInput,
  RewardsStat,
} from "./types/rewards.interface";
import { GetRefRewardInput, RefReward } from "./types/ref.rewards.interface";
import { GetReferralsInput, Referral } from "./types/referrals.interface";

export class CentherStaking {
  private _connection: IApolloProvider = null;
  private _config: OptionalType<ICentherStakingConfig> = null;

  constructor(options?: ICentherStakingConfig) {
    this.initConnection(options?.subgraphUrl as string);
    this._config = options;
  }

  @CatchError()
  async createPool(
    library: Web3Provider,
    input: CreatePoolInput,
    files: StakingFiles,
    affiliateSettings: OptionalType<AddAffiliateSettingsInput>,
    statusController: ProgressCallback
  ): Promise<void> {
    let mappedData;
    try {
      // map data to solidity extractable data types
      statusController(CreatePoolStepsEnum.preflight, 0);
      mappedData = setupCreatePoolData(input);
      statusController(CreatePoolStepsEnum.preflight, 100);
    } catch (error) {
      throw error;
    }

    try {
      // set approval
      await this.handleTokenApprovals(
        library,
        mappedData,
        input.ownerAddress,
        statusController
      );
    } catch (error: any) {
      throw error;
    }

    try {
      // contract callstatic
      statusController(CreatePoolStepsEnum.examinate, 0);
      await BlockchainWrite.createStakingPool(
        library,
        mappedData,
        input.ownerAddress,
        true
      );

      statusController(CreatePoolStepsEnum.examinate, 100);
    } catch (error: any) {
      throw new CreatePoolCallStaticError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      // upload files
      mappedData.poolMetadata = await this.uploadPoolMetadata(
        files,
        input.poolMetadata,
        statusController
      );
    } catch (error) {
      throw error;
    }

    try {
      // call contract
      statusController(CreatePoolStepsEnum.contract, 0);
      await BlockchainWrite.createStakingPool(
        library,
        mappedData,
        input.ownerAddress,
        false
      );

      statusController(CreatePoolStepsEnum.contract, 100);
    } catch (error: any) {
      throw new CreatePoolCallContractError(
        error instanceof Error ? error.message : error
      );
    }

    const poolId = await BlockchainWrite.getCurrentStakingPoolId(library);
    if (affiliateSettings) {
      statusController(CreatePoolStepsEnum.affiliate, 0);
      await this.addAffiliateSettings(library, affiliateSettings, poolId);
      statusController(CreatePoolStepsEnum.affiliate, 100);
    } else if (mappedData.rewardModeForRef != 0) {
      throw new InvalidAffiliateSystemSettings(
        "Invalid affiliate system settings"
      );
    }
  }

  @CatchError()
  async getProjects(input: GetStakingProjectInput): Promise<StakingProject[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_PROJECTS);
    const result = await this._connection?.query({
      query,
      variables: {
        skip: input.getPage(),
        first: input.getPageSize(),
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.pools;
  }

  @CatchError()
  async getProject(poolId: number): Promise<StakingProject> {
    const query = QueryFactory.getQuery(QueryNames.GET_PROJECT);
    const result = await this._connection?.query({
      query,
      variables: {
        id: poolId + "",
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.pools[0];
  }

  @CatchError()
  async getUserStakes(
    library: Web3Provider,
    poolId: number,
    userAddress: string
  ): Promise<RewardsStat> {
    const result = await BlockchainRead.getUserStakingRewards(
      library,
      poolId,
      userAddress
    );

    return {
      totalClaimableReward: BigNumber.from(
        result.totalClaimableReward
      ).toString(),
      totalReward: BigNumber.from(result.totalReward).toString(),
      totalStakeAmount: BigNumber.from(result.totalStakeAmount).toString(),
      totolUnclaimableReward: BigNumber.from(
        result.totolUnclaimableReward
      ).toString(),
    };
  }

  @CatchError()
  async getUserClaimableRewards(
    library: Web3Provider,
    poolId: number,
    user: string
  ): Promise<string> {
    const result = await BlockchainRead.getUserClaimableStakingRewards(
      library,
      poolId,
      user
    );

    return result;
  }

  @CatchError()
  async getUserClaimedRewards(
    input: GetClaimedRewardsInput
  ): Promise<ClaimedRewards[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_USER_CLAIMED_REWARDS);
    const result = await this._connection?.query({
      query,
      variables: {
        poolId: input.poolId,
        user: input.user,
        first: input.getPageSize(),
        skip: input.getPage(),
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.rewardClaimeds;
  }

  @CatchError()
  async getTotalClaimedRefReward(
    poolId: string,
    user: string
  ): Promise<string> {
    const query = QueryFactory.getQuery(
      QueryNames.GET_USER_TOTAL_CLAIMED_REF_REWARDS
    );
    const result = await this._connection?.query({
      query,
      variables: {
        projectId: poolId,
        referral: user,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.rewards.reduce(
      (a: number, b: { amount: string }) => a + +b.amount,
      0
    );
  }

  @CatchError()
  async getClaimedRefRewards(input: GetRefRewardInput): Promise<RefReward[]> {
    try {
      const query = QueryFactory.getQuery(
        QueryNames.GET_USER_CLAIMED_REF_REWARDS
      );

      const result = await this._connection?.query({
        query,
        variables: {
          projectId: input.poolId,
          referral: input.user,
          first1: input.getPageSize(),
          skip1: input.getPage(),
        },
        fetchPolicy: "no-cache",
      });

      return result?.data.rewards;
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async getUserReferrals(
    library: Web3Provider,
    input: GetReferralsInput
  ): Promise<{ count: number; data: Referral[]; totalRewards: number }> {
    let firstLevel: Referral[] = [];
    let secondLevels: Referral[] = [];
    let thirdLevels: Referral[] = [];
    let fourthLevels: Referral[] = [];
    let fivethLevels: Referral[] = [];
    let sixthLevels: Referral[] = [];

    if (input.levels >= 1 && input.user?.length) {
      firstLevel = await this.getUserLevelReferrals(
        input.poolId,
        input.user,
        1
      );
    }

    if (input.levels >= 2 && firstLevel?.length > 0) {
      const secondLevelsPromise = firstLevel.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.id.split("-")[0], 2)
      );

      secondLevels = (await Promise.all(secondLevelsPromise)).flat();
    }

    if (input.levels >= 3 && secondLevels?.length > 0) {
      const thirdLevelsPromise = secondLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.id.split("-")[0], 3)
      );

      thirdLevels = (await Promise.all(thirdLevelsPromise)).flat();
    }

    if (input.levels >= 4 && thirdLevels?.length > 0) {
      const forthLevelsPromise = thirdLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.id.split("-")[0], 4)
      );

      fourthLevels = (await Promise.all(forthLevelsPromise)).flat();
    }

    if (input.levels >= 5 && fourthLevels?.length > 0) {
      const fivethLevelsPromise = fourthLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.id.split("-")[0], 5)
      );

      fivethLevels = (await Promise.all(fivethLevelsPromise)).flat();
    }

    if (input.levels == 6 && fivethLevels?.length > 0) {
      const sixthLevelsPromise = fivethLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.id.split("-")[0], 6)
      );

      sixthLevels = (await Promise.all(sixthLevelsPromise)).flat();
    }

    let finalResult = [
      ...firstLevel,
      ...secondLevels,
      ...thirdLevels,
      ...fourthLevels,
      ...fivethLevels,
      ...sixthLevels,
    ].sort((a, b) => +b.joinedAt - +a.joinedAt);
    let start = 0;
    let end = finalResult.length - 1;

    if (input.page && input.pageSize) {
      start = input.page == 0 ? 0 : input.page - 1 * input.pageSize;
      end = input.page * input.pageSize;
    }

    if (finalResult.length) {
      const getUsersStakes = finalResult.map((e) =>
        this.calcStakedAmount(e, input.poolId, library)
      );

      finalResult = await Promise.all(getUsersStakes);
    }

    if (finalResult.length && input.isClaimable) {
      const getUserRefRewards = finalResult.map((e) =>
        this.getUserLevelRefRewards(e, input.poolId, library)
      );

      finalResult = await Promise.all(getUserRefRewards);
    }

    const totalRewards = finalResult.reduce((a: number, b: Referral) => {
      if (b.claimableReward) {
        return a + +b.claimableReward;
      } else return a;
    }, 0);

    return {
      count: finalResult.length,
      data: finalResult.slice(start, end),
      totalRewards,
    };
  }

  @CatchError()
  async stake(
    library: Web3Provider,
    poolId: number,
    userAddress: string,
    amount: string,
    tokenAddress: string
  ): Promise<void> {
    try {
      const referrers = await BlockchainRead.getReferrersAddress(
        library,
        userAddress
      );

      const referrer = referrers[0];

      const result = await BlockchainWrite.stake(
        library,
        poolId + "",
        amount,
        referrer,
        tokenAddress,
        AddressFactory.getContractAddress(SmartContractName.STAKING)
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async claimReward(library: Web3Provider, poolId: number): Promise<void> {
    try {
      const result = await BlockchainWrite.claimReward(library, poolId + "");

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async claimRefReward(
    library: Web3Provider,
    poolId: number,
    user: string
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.claimRefReward(
        library,
        poolId + "",
        user
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async unstake(
    library: Web3Provider,
    poolId: number,
    amount: string
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.unstake(
        library,
        poolId + "",
        amount
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async restake(library: Web3Provider, poolId: number): Promise<void> {
    try {
      const result = await BlockchainWrite.restake(library, poolId + "");

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  async getReferralClaimableReward(
    library: Web3Provider,
    user: string,
    poolId: number
  ): Promise<string> {
    const result = await BlockchainRead.getRefClaimableReward(
      library,
      poolId,
      user
    );

    return result;
  }

  private async getUserLevelRefRewards(
    input: Referral,
    poolId: string,
    library: Web3Provider
  ): Promise<Referral> {
    try {
      const result = await this.getReferralClaimableReward(
        library,
        input.id.split("-")[0],
        +poolId
      );
      input.claimableReward = result;
      return input;
    } catch (error) {
      return input;
    }
  }

  private async getUserLevelReferrals(
    poolId: string,
    user: string,
    level: number
  ): Promise<Referral[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_USER_REFERRALS);
    const result = await this._connection?.query({
      query,
      variables: {
        referrer: user,
        pool: poolId,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.users.map((e: Partial<Referral>) => {
      return {
        referrer: e.referrer,
        joinedAt: e.joinedAt,
        id: e.id,
        level,
      };
    });
  }

  private async calcStakedAmount(
    input: Referral,
    poolId: string,
    library: Web3Provider
  ): Promise<Referral> {
    const data = await this.getUserStakes(
      library,
      +poolId,
      input.id.split("-")[0]
    );

    input.stakedAmount = data.totalStakeAmount;
    return input;
  }

  private async addAffiliateSettings(
    library: Web3Provider,
    input: AddAffiliateSettingsInput,
    poolId: number
  ): Promise<void> {
    try {
      await BlockchainWrite.setStakingPoolAffiliateSettings(
        library,
        input,
        poolId
      );
    } catch (error: any) {
      throw new InvalidAffiliateSystemSettings(
        error instanceof Error ? error.message : error
      );
    }
  }

  private async uploadPoolMetadata(
    files: StakingFiles,
    input: CreatePoolMetadata,
    statusController: ProgressCallback
  ): Promise<string> {
    const uploaderIns = new StakingUploader();
    return uploaderIns.uploadMetadata(
      input,
      files.banner,
      files.logo,
      statusController
    );
  }

  private async handleTokenApprovals(
    library: Web3Provider,
    input: MappedCreatePoolInput,
    ownerAddress: string,
    statusController: ProgressCallback
  ): Promise<void> {
    try {
      statusController(CreatePoolStepsEnum.stake_approval, 0);
      statusController(CreatePoolStepsEnum.stake_approval, 20);

      await BlockchainWrite.SetApprovalForWallet(
        library,
        input.stakeToken,
        ownerAddress,
        AddressFactory.getContractAddress(SmartContractName.STAKING)
      );

      statusController(CreatePoolStepsEnum.stake_approval, 100);
    } catch (error: any) {
      let message = "";
      if (error instanceof InsufficientFundError) {
        message = "Staking token balance is 0";
      } else {
        message = error instanceof Error ? error.message : error;
      }

      throw new WalletApprovalError(message);
    }

    if (
      input.rewardToken?.length > 0 &&
      ZeroAddress != input.rewardToken &&
      !eqAddress(input.stakeToken, input.rewardToken)
    ) {
      try {
        statusController(CreatePoolStepsEnum.reward_approval, 0);
        statusController(CreatePoolStepsEnum.reward_approval, 20);

        await BlockchainWrite.SetApprovalForWallet(
          library,
          input.rewardToken,
          ownerAddress,
          AddressFactory.getContractAddress(SmartContractName.STAKING)
        );

        statusController(CreatePoolStepsEnum.reward_approval, 100);
      } catch (error: any) {
        let message = "";
        if (error instanceof InsufficientFundError) {
          message = "Reward token balance is 0";
        } else {
          message = error instanceof Error ? error.message : error;
        }

        throw new WalletApprovalError(message);
      }
    }
  }

  private initConnection(url: string): void {
    this._connection = getConnection(url);
  }
}
