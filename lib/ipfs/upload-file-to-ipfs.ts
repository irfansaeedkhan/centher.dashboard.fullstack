import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { UploadToIPFSResponse } from "./types";

export const uploadFileToIPFS = async (
  file: Blob
): Promise<UploadToIPFSResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const { data } = await axiosCFS.post<UploadToIPFSResponse>(
      `/ipfs/upload/file`,
      formData
    );
    return data;
  } catch (error: any) {
    let errorMessage = "Can not upload file to IPFS";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "uploadFileToIPFS");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "uploadFileToIPFS"
      );
    }
  }
};
