import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";
import { getPaginationInfo } from "../helpers/pagination.helper";

export type OptionalType<T> = T | null | undefined;

export interface Web3 {
  contract: OptionalType<Contract>;
  signer: OptionalType<JsonRpcSigner>;
}

export class PaginatedRequest {
  page?: number;
  pageSize?: number;

  getPage(): number {
    return getPaginationInfo(this.page, this.pageSize).skip;
  }
  getPageSize(): number {
    return getPaginationInfo(this.page, this.pageSize).limit;
  }
}
