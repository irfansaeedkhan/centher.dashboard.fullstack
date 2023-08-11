import { Web3Provider } from "@ethersproject/providers";
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

import { StakingUploader } from "@/utils/upload.tools/staking.metadata.uploader.utils";
import { BlockchainWrite } from "@/web3/blockchain";
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
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { eqAddress } from "@/live/utils/address.utils";
import { ZeroAddress } from "@/web3/constants/common";

export class CentherStaking {
  constructor(options?: ICentherStakingConfig) {}

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
}
