import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export type FetchParam = {
  address: string;
  chain: EvmChain;
};

export type TokenPriceResult = Awaited<
  ReturnType<typeof Moralis.EvmApi.token.getTokenPrice>
>;

export type WalletNftsResult = Awaited<
  ReturnType<typeof Moralis.EvmApi.nft.getWalletNFTs>
>;

export type FetchFuncWrapper = {
  token: { getTokenPrice: (param: FetchParam) => Promise<TokenPriceResult> };
  nft: { getWalletNFTs: (param: FetchParam) => Promise<WalletNftsResult> };
};
