import { BlockchainConfig } from "../config";
import { Networks } from "../enum/networks.enum";
import { SmartContractName } from "../enum/smart.contract.name.enum";

export class AddressFactory {
  static getContractInitializationDependencies(name: SmartContractName): {
    address: string;
    abi: any;
  } {
    const abi = this.getContractAbi(name);
    const address = this.getContractAddress(name);
    return { abi, address };
  }

  static getContractAddress(name: SmartContractName): string {
    this.validateName(name);
    const network = this.getBlockchainNetwork();
    return this.getContractAddressByNetwork(name, network);
  }

  static getContractAbi(name: SmartContractName): any {
    this.validateName(name);
    return BlockchainConfig.abis[name];
  }

  static getStandardTokenAbi(): any {
    return BlockchainConfig.abis.ERC721;
  }

  static getERC20TokenAbi(): any {
    return BlockchainConfig.abis.BUSD;
  }

  static getBlockchainNetwork(): Networks {
    return BlockchainConfig.network;
  }

  static getContractAddressByNetwork(
    name: SmartContractName,
    network: Networks
  ): string {
    return BlockchainConfig.contracts[name][network];
  }

  private static validateName(name: SmartContractName): void {
    if (!name?.length) throw new Error("invalid contract name");
  }
}
