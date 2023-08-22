import { EvmChain } from "@moralisweb3/common-evm-utils";
import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { customLog } from "@/utils/custom.log";

export const fetchTokenMetadata = async (addresses: string[]) => {
  try {
    if (!addresses?.length) {
      return [];
    }

    const fetcher = new MoralisFetcher();
    const metadata = await fetcher.getTokenMetadata({
      addresses,
      chain:
        process.env.NODE_ENV == "production" ? EvmChain.BSC : EvmChain.GOERLI,
    });
    return metadata;
  } catch (error: any) {
    customLog(["development"], error);
  }
};
