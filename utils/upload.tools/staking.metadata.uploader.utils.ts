import {
  CreatePoolMetadata,
  OptionalType,
  ProgressCallback,
} from "@/staking/types";
import {
  CreatePoolUploadBannerError,
  CreatePoolUploadLogoError,
  CreatePoolUploadMetadataError,
} from "@/staking/errors/params.error";
import { CreatePoolStepsEnum } from "@/staking/enum/create-pool-steps.enum";
import { uploadFileToIPFS, uploadMetadataToIPFS } from "@/lib/ipfs";

export class StakingUploader {
  async uploadMetadata(
    info: CreatePoolMetadata,
    banner: OptionalType<Blob>,
    icon: OptionalType<Blob>,
    statusController: ProgressCallback
  ): Promise<string> {
    if (!banner || !icon || !info) {
      throw new Error("invalid files.");
    }

    try {
      statusController(CreatePoolStepsEnum.banner, 0);
      statusController(CreatePoolStepsEnum.banner, 20);
      const { ipfs_url: bannerIpfsUrl } = await uploadFileToIPFS(banner);
      info.banner = bannerIpfsUrl;
      statusController(CreatePoolStepsEnum.banner, 100);
    } catch (error: any) {
      throw new CreatePoolUploadBannerError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      statusController(CreatePoolStepsEnum.logo, 0);
      statusController(CreatePoolStepsEnum.logo, 20);
      const { ipfs_url: iconIpfsUrl } = await uploadFileToIPFS(icon);
      info.icon = iconIpfsUrl;
      statusController(CreatePoolStepsEnum.logo, 100);
    } catch (error: any) {
      throw new CreatePoolUploadLogoError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      statusController(CreatePoolStepsEnum.metadata, 0);
      statusController(CreatePoolStepsEnum.metadata, 20);
      const { ipfs_url: metadataIpfsUrl } = await uploadMetadataToIPFS(info);
      statusController(CreatePoolStepsEnum.metadata, 100);
      return metadataIpfsUrl;
    } catch (error: any) {
      throw new CreatePoolUploadMetadataError(
        error instanceof Error ? error.message : error
      );
    }
  }
}
