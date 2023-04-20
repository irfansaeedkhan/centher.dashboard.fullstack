import { BlockchainConfig } from "../config";
import { Networks } from "../enum/networks.enum";

export const old_native_collection_address =
  "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6";

export const old_native_collection_name = "Yoda's Hub";

export const old_native_collection_address_testnet =
  "0x94a667eeb68ba9290e7df5a257475ddb2348c955";

export const old_native_collection_name_testnet =
  "Test old native collection name";

export function isOld(collection: string): boolean {
  const name = isMainnet()
    ? old_native_collection_address.toLowerCase()
    : old_native_collection_address_testnet.toLowerCase();
  return collection.toLowerCase() == name;
}

export function getOldName(): string {
  return isMainnet()
    ? old_native_collection_name
    : old_native_collection_name_testnet;
}

function isMainnet(): boolean {
  return BlockchainConfig.network == Networks.BSC;
}
