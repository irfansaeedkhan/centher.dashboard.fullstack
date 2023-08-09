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
      const uploadBannerDto = {
        path: this._uploader.makePath(),
        content: banner,
      };

      info.banner = await this._uploader.upload(uploadBannerDto, (prog) => {
        statusController(CreatePoolStepsEnum.banner, prog);
      });
    } catch (error: any) {
      throw new CreatePoolUploadBannerError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      const uploadIconDto = {
        path: this._uploader.makePath(),
        content: icon,
      };

      info.icon = await this._uploader.upload(uploadIconDto, (prog) => {
        statusController(CreatePoolStepsEnum.logo, prog);
      });
    } catch (error: any) {
      throw new CreatePoolUploadLogoError(
        error instanceof Error ? error.message : error
      );
    }

    try {
      const metaDataBuffered = this.toBuffer(JSON.stringify(info));

      const uploadMetaDataDto = {
        path: this._uploader.makePath("json"),
        content: metaDataBuffered,
      };

      const metaDataPath = await this._uploader.upload(
        uploadMetaDataDto,
        (prog) => {
          statusController(CreatePoolStepsEnum.metaData, prog);
        }
      );

      return metaDataPath;
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
