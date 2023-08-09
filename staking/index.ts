import { Web3Provider } from "@ethersproject/providers";
import { ICentherStakingConfig } from "./types/config.interface";
import {
  AddAffiliateSettingsInput,
  AddAffiliateSettingsResult,
  CreatePoolInput,
  CreatePoolResult,
  CreatePoolMetadata,
  StakingFiles,
  ProgressCallback,
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
  WalletApprovalError,
} from "./errors/params.error";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { eqAddress } from "@/live/utils/address.utils";

export class CentherStaking {
  constructor(options: ICentherStakingConfig) {}

  @CatchError()
  async createPool(
    library: Web3Provider,
    input: CreatePoolInput,
    files: StakingFiles,
    statusController: ProgressCallback
  ): Promise<CreatePoolResult> {
    let mappedData;
    try {
      // map data to solidity extractable data types
      mappedData = setupCreatePoolData(input);
    } catch (error) {
      throw error;
    }

    try {
      // set approval
      await this.handleTokenApprovals(library, input);
    } catch (error: any) {
      throw error;
    }

    try {
      // contract callstatic
      statusController(CreatePoolStepsEnum.preFlight, 0);
      await BlockchainWrite.createStakingPool(library, mappedData, true);
      statusController(CreatePoolStepsEnum.preFlight, 100);
    } catch (error: any) {
      throw new CreatePoolCallStaticError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      // upload files
      mappedData = await this.uploadPoolMetadata(
        files,
        input.poolMetadata,
        statusController
      );
    } catch (error) {
      throw error;
    }

    try {
      // call contract
      statusController(CreatePoolStepsEnum.contractCall, 0);
      const hash = await BlockchainWrite.createStakingPool(
        library,
        mappedData,
        true
      );

      statusController(CreatePoolStepsEnum.contractCall, 100);

      return {
        success: !!hash?.length,
        trxHash: hash,
      };
    } catch (error: any) {
      throw new CreatePoolCallContractError(
        error instanceof Error ? error.message : error
      );
    }
  }

  @CatchError()
  async addAffiliateSettings(
    library: Web3Provider,
    input: AddAffiliateSettingsInput
  ): Promise<AddAffiliateSettingsResult> {
    throw new Error("Not Implemented");
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
    input: CreatePoolInput
  ): Promise<void> {
    try {
      await BlockchainWrite.SetApprovalForWallet(
        library,
        input.stakeToken,
        input.ownerAddress,
        AddressFactory.getContractAddress(SmartContractName.STAKING)
      );
    } catch (error) {
      let message = "";
      if (error instanceof InsufficientFundError) {
        message = "Staking token balance is 0";
      } else {
        message = "Set approval for staking token failed";
      }
      throw new WalletApprovalError(message);
    }

    if (!eqAddress(input.stakeToken, input.rewardToken)) {
      try {
        await BlockchainWrite.SetApprovalForWallet(
          library,
          input.rewardToken,
          input.ownerAddress,
          AddressFactory.getContractAddress(SmartContractName.STAKING)
        );
      } catch (error) {
        let message = "";
        if (error instanceof InsufficientFundError) {
          message = "Reward token balance is 0";
        } else {
          message = "Set approval for reward token failed";
        }
        throw new WalletApprovalError(message);
      }
    }
  }
}
