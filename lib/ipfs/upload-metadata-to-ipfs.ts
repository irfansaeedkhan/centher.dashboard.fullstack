import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { UploadToIPFSResponse } from "./types";

export const uploadMetadataToIPFS = async (
  metadata: any
): Promise<UploadToIPFSResponse> => {
  // throw error if the metadata is not valid JSON
  try {
    JSON.stringify(metadata);
  } catch {
    throw new Error("Invalid Metadata for IPFS");
  }

  try {
    const { data } = await axiosCFS.post<UploadToIPFSResponse>(
      `/ipfs/upload/metadata`,
      metadata
    );
    return data;
  } catch (error: any) {
    let errorMessage = "Can not upload metadata to IPFS";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "uploadMetadataToIPFS");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "uploadMetadataToIPFS"
      );
    }
  }
};
