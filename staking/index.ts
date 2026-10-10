import { BigNumber } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { StakingUploader } from "@/utils/upload.tools/staking.metadata.uploader.utils";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { ZeroAddress } from "@/web3/constants/common";
import { eqAddress } from "@/lib/chat/utils";
import { IApolloProvider } from "@/lib/chat/types";
import { IProductStakingConfig } from "./types/config.interface";
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
import { cacheIsOn, staking_projects } from "./cache";

export class ProductStaking {
  private _connection: IApolloProvider = null;
  private _config: OptionalType<IProductStakingConfig> = null;

  constructor(options?: IProductStakingConfig) {
    this.initConnection(options?.subgraphUrl as string);
    this._config = options;
  }

  @CatchError()
  async createPool(
    signer: JsonRpcSigner,
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
        signer,
        mappedData,
        input.ownerAddress,
        statusController
      );
    } catch (error: any) {
      throw error;
    }

    // try {
    //   // contract callstatic
    //   statusController(CreatePoolStepsEnum.examinate, 0);
    //   await BlockchainWrite.createStakingPool(
    //     signer,
    //     mappedData,
    //     input.ownerAddress,
    //     true
    //   );

    //   statusController(CreatePoolStepsEnum.examinate, 100);
    // } catch (error: any) {
    //   throw new CreatePoolCallStaticError(
    //     error instanceof Error ? error.message : error
    //   );
    // }

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
        signer,
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

    const poolId = await BlockchainWrite.getCurrentStakingPoolId(signer);
    if (affiliateSettings) {
      statusController(CreatePoolStepsEnum.affiliate, 0);
      await this.addAffiliateSettings(signer, affiliateSettings, poolId);
      statusController(CreatePoolStepsEnum.affiliate, 100);
    } else if (mappedData.rewardModeForRef != 0) {
      throw new InvalidAffiliateSystemSettings(
        "Invalid affiliate system settings"
      );
    }
  }

  @CatchError()
  async getProjects(input: GetStakingProjectInput): Promise<StakingProject[]> {
    if (cacheIsOn && process.env.NEXT_PUBLIC_APP_ENV === "production") {
      return staking_projects as any;
    } else {
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
  }

  @CatchError()
  async getProject(
    poolId: number,
    userAddress: string
  ): Promise<StakingProject> {
    const query = QueryFactory.getQuery(QueryNames.GET_PROJECT);

    const result = await this._connection?.query({
      query,
      variables: {
        id: poolId + "",
        user: userAddress,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.pools[0];
  }

  @CatchError()
  async getProjectOverview(poolId: number): Promise<any> {
    const query = QueryFactory.getQuery(QueryNames.GET_POOL_OVERVIEW);

    const result = await this._connection?.query({
      query,
      variables: {
        id: poolId + "",
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.pool;
  }

  @CatchError()
  async getUserStakes(
    signer: JsonRpcSigner,
    poolId: number,
    userAddress: string
  ): Promise<RewardsStat> {
    try {
      const result = await BlockchainRead.getUserStakingRewards(
        signer,
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
    } catch (error) {
      return {
        totalClaimableReward: "0",
        totalReward: "0",
        totalStakeAmount: "0",
        totolUnclaimableReward: "0",
      };
    }
  }

  @CatchError()
  async getUserClaimableRewards(
    signer: JsonRpcSigner,
    poolId: number,
    user: string
  ): Promise<string> {
    const result = await BlockchainRead.getUserClaimableStakingRewards(
      signer,
      poolId,
      user
    );

    return result;
  }

  @CatchError()
  async getUserReferrals(
    signer: JsonRpcSigner,
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
        this.getUserLevelReferrals(input.poolId, e.user, 2)
      );

      secondLevels = (await Promise.all(secondLevelsPromise)).flat();
    }

    if (input.levels >= 3 && secondLevels?.length > 0) {
      const thirdLevelsPromise = secondLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.user, 3)
      );

      thirdLevels = (await Promise.all(thirdLevelsPromise)).flat();
    }

    if (input.levels >= 4 && thirdLevels?.length > 0) {
      const forthLevelsPromise = thirdLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.user, 4)
      );

      fourthLevels = (await Promise.all(forthLevelsPromise)).flat();
    }

    if (input.levels >= 5 && fourthLevels?.length > 0) {
      const fivethLevelsPromise = fourthLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.user, 5)
      );

      fivethLevels = (await Promise.all(fivethLevelsPromise)).flat();
    }

    if (input.levels == 6 && fivethLevels?.length > 0) {
      const sixthLevelsPromise = fivethLevels.map((e) =>
        this.getUserLevelReferrals(input.poolId, e.user, 6)
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

    if (finalResult.length) {
      const getUsersStakes = finalResult.map((e) =>
        this.calcStakedAmount(e, input.poolId, signer)
      );

      finalResult = await Promise.all(getUsersStakes);
    }

    if (finalResult.length && input.isClaimable) {
      const getUserRefRewards = finalResult.map((e) =>
        this.getUserLevelRefRewards(e, input.poolId, signer)
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
      data: finalResult,
      totalRewards,
    };
  }

  @CatchError()
  async stake(
    signer: JsonRpcSigner,
    poolId: number,
    userAddress: string,
    amount: string,
    tokenAddress: string
  ): Promise<void> {
    try {
      const referrers = await BlockchainRead.getReferrersAddress(
        signer,
        userAddress
      );

      const referrer = referrers[0];

      const result = await BlockchainWrite.stake(
        signer,
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
  async claimReward(
    signer: JsonRpcSigner,
    poolId: number,
    stakesId: number[]
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.claimReward(
        signer,
        poolId + "",
        stakesId
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async claimRefReward(
    signer: JsonRpcSigner,
    poolId: number,
    users: string[]
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.claimRefReward(
        signer,
        poolId + "",
        users
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async stakeRefReward(
    signer: JsonRpcSigner,
    userAddress: string,
    poolId: number,
    users: string[]
  ): Promise<void> {
    try {
      const referrers = await BlockchainRead.getReferrersAddress(
        signer,
        userAddress
      );

      const referrer = referrers[0];

      const result = await BlockchainWrite.stakeRefReward(
        signer,
        poolId + "",
        users,
        referrer
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
    signer: JsonRpcSigner,
    poolId: number,
    stakesId: number[]
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.unstake(
        signer,
        poolId + "",
        stakesId
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async restake(
    signer: JsonRpcSigner,
    poolId: number,
    stakesId: number[]
  ): Promise<void> {
    try {
      const result = await BlockchainWrite.restake(
        signer,
        poolId + "",
        stakesId
      );

      if (!result?.length) {
        throw new Error("Invalid transaction");
      }
    } catch (error) {
      throw error;
    }
  }

  @CatchError()
  async getReferralClaimableReward(
    signer: JsonRpcSigner,
    user: string,
    poolId: number
  ): Promise<{
    nextTime: string;
    claimableReward: string;
  }> {
    const result = await BlockchainRead.getRefClaimableReward(
      signer,
      poolId,
      user
    );

    return result;
  }

  @CatchError()
  async getStakeDetails(
    signer: JsonRpcSigner,
    poolId: number,
    user: string,
    stakeId: number
  ): Promise<any> {
    const { totalClaimableReward, nextClaimTime } =
      await BlockchainRead.getStakeDetails(signer, poolId, user, stakeId);

    return {
      totalClaimableReward: totalClaimableReward?.toString(),
      nextClaimTime: nextClaimTime?.toString(),
    };
  }

  private async getUserLevelRefRewards(
    input: Referral,
    poolId: string,
    signer: JsonRpcSigner
  ): Promise<Referral> {
    try {
      const result = await this.getReferralClaimableReward(
        signer,
        input.user,
        +poolId
      );

      input.claimableReward = result.claimableReward;
      input.nextTime =
        result.nextTime && +result.nextTime > 0
          ? +result.nextTime + 60 + ""
          : result.nextTime;
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
        user: e.user,
      };
    });
  }

  private async calcStakedAmount(
    input: Referral,
    poolId: string,
    signer: JsonRpcSigner
  ): Promise<Referral> {
    const data = await this.getUserStakes(signer, +poolId, input.user);

    input.stakedAmount = data.totalStakeAmount;
    return input;
  }

  private async addAffiliateSettings(
    signer: JsonRpcSigner,
    input: AddAffiliateSettingsInput,
    poolId: number
  ): Promise<void> {
    try {
      await BlockchainWrite.setStakingPoolAffiliateSettings(
        signer,
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
    signer: JsonRpcSigner,
    input: MappedCreatePoolInput,
    ownerAddress: string,
    statusController: ProgressCallback
  ): Promise<void> {
    const stakeTokenAllowance = await this.handleTokenAllowance(
      signer,
      input.stakeToken,
      ownerAddress
    );

    if (!stakeTokenAllowance) {
      try {
        statusController(CreatePoolStepsEnum.stake_approval, 0);
        statusController(CreatePoolStepsEnum.stake_approval, 20);
        await BlockchainWrite.SetApprovalForWallet(
          signer,
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
    }

    if (
      input.rewardToken?.length > 0 &&
      ZeroAddress != input.rewardToken &&
      !eqAddress(input.stakeToken, input.rewardToken)
    ) {
      try {
        statusController(CreatePoolStepsEnum.reward_approval, 0);
        statusController(CreatePoolStepsEnum.reward_approval, 20);

        if (
          await this.handleTokenAllowance(
            signer,
            input.rewardToken,
            ownerAddress
          )
        )
          return;

        await BlockchainWrite.SetApprovalForWallet(
          signer,
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

  private async handleTokenAllowance(
    signer: JsonRpcSigner,
    token: string,
    ownerAddress: string
  ): Promise<Boolean> {
    const allowances = await BlockchainRead.getERC20Allowance(
      signer,
      token,
      ownerAddress,
      AddressFactory.getContractAddress(SmartContractName.STAKING)
    );

    const maxUintRange =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    return Number(allowances) === Number(maxUintRange);
  }

  private initConnection(url: string): void {
    this._connection = getConnection(url);
  }
}
