import { CFSNFT, NFTSaleStateFilter, OrderDirection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getNFTListOfSingleCollection = async ({
  collection_address,
  orderDir = "desc",
  saleState = "All",
  limit = 50,
  skip = 0,
}: {
  collection_address: string;
  orderDir?: OrderDirection;
  saleState?: NFTSaleStateFilter;
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    // Portfolio-library fix (Centher item 1): the collection UI filter
    // vocabulary ("List"/"NON") is NOT the API vocabulary ("Sale"/
    // "NotForSale"). The server treats any value other than "Sale" as
    // not-listed, so the old pass-through made "Listed For Sale" return
    // the UNLISTED items: with 5 items, 4 listed (header: 80%), the
    // filter showed the 1 unlisted item. Translate here so the filter,
    // the header listed %, and the items shown all derive from the same
    // `listed` column. "Auction" has no server state (the DB marketplace
    // has no auctions), so it is left untranslated rather than silently
    // mapped onto listed items.
    const apiSaleState =
      saleState === "List"
        ? "Sale"
        : saleState === "NON"
        ? "NotForSale"
        : saleState;
    const { data } = await axiosCFS.get<{ nfts: CFSNFT[] }>(
      `/api/marketplace/nfts/${collection_address}`,
      {
        params: {
          first: limit,
          skip,
          orderDir,
          saleState: apiSaleState,
        },
      }
    );
    return data.nfts ?? [];
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getNFTListOfSingleCollection"
    );
  }
};
