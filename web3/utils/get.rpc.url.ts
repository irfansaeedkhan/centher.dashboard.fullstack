import sample from "lodash/sample";
import { BSC_RPC_URLS } from "../constants/common";

// Array of available nodes to connect to
export const nodes = BSC_RPC_URLS;

const getNodeUrl = () => {
  return sample(nodes);
};

export default getNodeUrl;
