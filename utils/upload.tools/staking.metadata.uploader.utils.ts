import { CreatePoolStepsEnum } from "@/staking/enum/create-pool-steps.enum";
import { IUploader } from "./interfaces/file.uploader.interface";
import { MoralisUploader } from "./uploaders/moralis.upload.util";
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

export class StakingUploader {
  _uploader: IUploader;

  constructor(uploader?: IUploader) {
    if (uploader) {
      this._uploader = uploader;
    } else {
      this._uploader = new MoralisUploader();
    }
  }

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
      const uploadBannerDto = {
        path: this._uploader.makePath(),
        content: banner,
      };

      statusController(CreatePoolStepsEnum.banner, 20);
      info.banner = await this._uploader.upload(uploadBannerDto);
      statusController(CreatePoolStepsEnum.banner, 100);
    } catch (error: any) {
      throw new CreatePoolUploadBannerError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      statusController(CreatePoolStepsEnum.logo, 0);
      const uploadIconDto = {
        path: this._uploader.makePath(),
        content: icon,
      };
      statusController(CreatePoolStepsEnum.logo, 20);
      info.icon = await this._uploader.upload(uploadIconDto);
      statusController(CreatePoolStepsEnum.logo, 100);
    } catch (error: any) {
      throw new CreatePoolUploadLogoError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      statusController(CreatePoolStepsEnum.metadata, 0);
      const metaDataBuffered = this.toBuffer(JSON.stringify(info));
      statusController(CreatePoolStepsEnum.metadata, 5);
      const uploadMetaDataDto = {
        path: this._uploader.makePath("json"),
        content: metaDataBuffered,
      };

      statusController(CreatePoolStepsEnum.metadata, 20);
      const metaDataPath = await this._uploader.upload(uploadMetaDataDto);
      statusController(CreatePoolStepsEnum.metadata, 100);
      return `ipfs:${metaDataPath}`;
    } catch (error: any) {
      throw new CreatePoolUploadMetadataError(
        error instanceof Error ? error.message : error
      );
    }
  }

  private toBuffer(input: any): Buffer {
    return Buffer.from(input);
  }
}
