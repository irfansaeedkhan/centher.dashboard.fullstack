import { supportedNetworksList } from "@/web3/constants/common";
import { Networks } from "../enum/networks.enum";
import { QueryNames } from "../enum/query.names.enum";
import { SmartContractName } from "../enum/smart.contract.name.enum";
import { Signer, providers, BigNumber } from "ethers";
import { ERC721Name } from "../enum/erc721.enum";

export type IQueryStorage = Record<QueryNames, string>;
export type NetworkAddress = Record<keyof typeof supportedNetworksList, string>;
export type IContractAddressHolder = Record<SmartContractName, NetworkAddress>;
export type SupportedNetworksList = Record<Networks, boolean>;
export type SignerOrProvider = Signer | providers.Provider;
export type SystemSmartContractAbiHolder = Record<SmartContractName, any>;
export type SmartContractNameWithERC721 = ERC721Name | SmartContractName;
export type SmartContractAbisHolder = Record<SmartContractNameWithERC721, any>;
export type TokenName = "BUSD" | "NTR" | "CTHR";
export type ClaimCentherFrom = "BUSD" | "NTR";
export interface UserReferrer {
  id: number;
  address: string;
  level: number;
  generatedBUSD: number;
  generatedNTR: number;
  people: number;
}
export interface Fee {
  createItemFeeForMarketplace: number;
  createItemFeeForCreator: number;
  createCollectionFee: number;
  buyItemFeeForMarketplace: number;
  buyItemFeeForCreator: number;
  buyItemFeeForMultilevel: number;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
}
export type IBlockchainConfig = {
  supportedNetworks: SupportedNetworksList;
  contracts: IContractAddressHolder;
  abis: SmartContractAbisHolder;
  network: Networks;
  rpcProvider: string;
  toastErrors: boolean;
  maxSupply: BigNumber;
  networkDecimals: number;
  percent: number[];
  fee: Fee;
  scannerUrl: string;
  ipfsUrl: string;
  subgraphUrl: string;
};
