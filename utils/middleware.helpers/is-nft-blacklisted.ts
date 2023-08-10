import { GlobalTokenBlackList } from "@/web3/blockchain/helpers/blacklist.helper";

export const isNFTBlacklisted = (urlPathname: string): boolean => {
  const pathParts = urlPathname.split("/").filter(Boolean);

  if (pathParts.length >= 3) {
    const collection = pathParts[1];
    const tokenId = pathParts[2];
    return GlobalTokenBlackList.isBlocked(collection, +tokenId);
  } else {
    return false;
  }
};
