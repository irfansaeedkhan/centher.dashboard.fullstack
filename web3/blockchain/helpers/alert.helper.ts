import toast from "react-hot-toast";
import { parseErrorMsg } from "@/web3/utils/utils";
import { customLog } from "@/utils/custom.log";
import { BlockchainConfig } from "../config";

export function logger(error: any, sender?: string): void {
  error = typeof error == "string" ? new Error(error) : error;
  if (BlockchainConfig.toastErrors) {
    toast.error(error.message);
  }
  customLog(error, ["development"]);
}
