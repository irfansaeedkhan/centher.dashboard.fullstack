import Moralis from "moralis";

import {
  FetchFuncWrapper,
  FetchParam,
  GetTokenMetadaInput,
  WalletNftsResult,
} from "./interfaces";

export class MoralisFetcher {
  private _instance: FetchFuncWrapper | null = null;

  async getTokenMetadata(param: GetTokenMetadaInput): Promise<any> {
    await this.checkInstance();
    const result = await this._instance?.token.getTokenMetadata(param);
    return result?.result;
  }

  async getTokenPrice(param: FetchParam): Promise<number | undefined> {
    await this.checkInstance();
    const result = await this._instance?.token.getTokenPrice(param);
    return result?.result?.usdPrice;
  }

  async getWalletNfts(
    param: FetchParam
  ): Promise<WalletNftsResult | undefined> {
    await this.checkInstance();
    return this._instance?.nft.getWalletNFTs(param);
  }

  private async checkInstance(): Promise<void> {
    if (!this._instance) {
      this._instance = await this.initInstance();
    }
  }

  private async initInstance(): Promise<FetchFuncWrapper> {
    if (!process.env.NEXT_PUBLIC_MORALIS_URL?.length) {
      throw new Error("Moralis apikey not found in environment variables.");
    }

    try {
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_URL,
      });
    } catch (err) {}

    return {
      token: {
        getTokenPrice: Moralis.EvmApi.token.getTokenPrice,
        getTokenMetadata: Moralis.EvmApi.token.getTokenMetadata,
      },
      nft: { getWalletNFTs: Moralis.EvmApi.nft.getWalletNFTs },
    };
  }
}
