import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ICentherStakingConfig } from "./types/config.interface";
import { Contract } from "ethers";
import {
  OptionalType,
  AddAffiliateSettingsInput,
  AddAffiliateSettingsResult,
  CreatePoolInput,
  CreatePoolResult,
  Web3,
  CreatePoolMetadata,
} from "./types";
import { getSigner } from "./helpers/provider.helper";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

export class CentherStaking {
  constructor(options: ICentherStakingConfig) {}

  async createPool(
    library: Web3Provider,
    input: CreatePoolInput
  ): Promise<CreatePoolResult> {
    this.setupProvider(library);
    const metaDataUrl = this.uploadPoolMetadata(input.poolMetadata);
    throw new Error("Not Implemented");
  }

  async addAffiliateSettings(
    library: Web3Provider,
    input: AddAffiliateSettingsInput
  ): Promise<AddAffiliateSettingsResult> {
    this.setupProvider(library);
    throw new Error("Not Implemented");
  }

  private setupProvider(library: Web3Provider): Web3 {
    if (library) throw new Error("Invalid web 3 provider");
    const signer = getSigner(library);
    const contract = SmartContractProvider.getContract(
      SmartContractName.STAKING
    );

    return { contract, signer };
  }
  private uploadPoolMetadata(input: CreatePoolMetadata): Promise<string> {
    throw new Error("Not Implemented");
  }
}
