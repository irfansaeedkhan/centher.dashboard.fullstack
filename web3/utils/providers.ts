import { ethers } from "ethers";
import getRpcUrl from "./get.rpc.url";

const RPC_URL = getRpcUrl();

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
  RPC_URL
);
