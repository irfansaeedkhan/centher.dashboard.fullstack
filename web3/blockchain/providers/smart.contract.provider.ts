import { Contract } from "ethers";
import { BlockchainConfig } from "../config";
import { SmartContractName } from "../enum/smart.contract.name.enum";
import { getDefaultProvider } from "../helpers/provider.helper";
import { SignerOrProvider, TokenName } from "../types";
import { AddressFactory } from "./address.provider";

export class SmartContractProvider {
  static getContract(
    name: SmartContractName,
    signer?: SignerOrProvider
  ): Contract {
    const { abi, address } =
      AddressFactory.getContractInitializationDependencies(name);
    const instance = this.getContractInstance(abi, address, signer);
    if (!instance) {
      throw new Error("Invalid smart contract instance");
    }

    return instance;
  }

  static getNFTContract(
    nftAddress: string,
    signer?: SignerOrProvider
  ): Contract {
    if (!signer) {
      signer = getDefaultProvider(BlockchainConfig.rpcProvider);
    }

    const abi = AddressFactory.getStandardTokenAbi();
    return new Contract(nftAddress, abi, signer);
  }

  static getContractInstance(
    abi: any,
    address: string,
    signer?: SignerOrProvider
  ): Contract {
    if (!abi || !address) {
      throw new Error("Invalid abi or address");
    }

    if (!signer) {
      signer = getDefaultProvider(BlockchainConfig.rpcProvider);
    }

    return new Contract(address, abi, signer);
  }

  static getTokenContract(
    tokenName: TokenName,
    signer?: SignerOrProvider
  ): any {
    let tokenContractName;
    if (tokenName == "BUSD") {
      tokenContractName = SmartContractName.BUSD;
    } else if (tokenName == "NTR") {
      tokenContractName = SmartContractName.NTR;
    } else {
      tokenContractName = SmartContractName.CENTHER_TOKEN;
    }

    if (!tokenContractName) {
      throw new Error("Token contract not found");
    }

    return this.getContract(tokenContractName, signer);
  }
}
