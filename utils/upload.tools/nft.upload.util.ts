import { INFTData } from "@/pages/marketplace/_components/create.nft.form";
import { INFTDetails } from "./interfaces/nft.details.interface";
import { NFTMetaData } from "./interfaces/nft.metadata.interface";
import { IUploader } from "./interfaces/file.uploader.interface";
import { safeNameType } from "./interfaces/safe.file.wrapper.interface";
import { MoralisUploader } from "./uploaders/moralis.upload.util";

export class NFTUploader {
  private _uploader: IUploader;
  private _imagesBasePath: string;

  constructor(imagesBasePath: string, uploader?: IUploader) {
    this._imagesBasePath = imagesBasePath;
    if (uploader) {
      this._uploader = uploader;
    } else {
      this._uploader = new MoralisUploader();
    }
  }

  async uploadNFT(
    file: any,
    nftData: INFTData,
    nameWrapper: safeNameType,
    videoThumbnail?: any
  ): Promise<string> {
    let imagePath = "";
    let thumbnailPath = "";

    if (!file) {
      throw new Error("invalid file.");
    }

    imagePath = await this.uploadFile(file);

    if (videoThumbnail) {
      thumbnailPath = await this.uploadFile(videoThumbnail);
    }

    const metadata = this.createMetaData(
      nftData,
      imagePath,
      nameWrapper,
      thumbnailPath
    );

    const metaDataBuffered = this.toBuffer(JSON.stringify(metadata));

    return this.uploadFile(metaDataBuffered, "json");
  }

  private async uploadFile(file: any, extention?: string): Promise<string> {
    const fileDto = {
      path: this._uploader.makePath(extention),
      content: file,
    };

    return this._uploader.upload(fileDto);
  }
  private toBuffer(input: any): Buffer {
    return Buffer.from(input);
  }

  private createMetaData(
    nftData: INFTData,
    path: string,
    nameWrapper: safeNameType,
    videoThumbnail?: any
  ): NFTMetaData {
    return {
      name: nftData.name,
      description: nftData.description,
      supply: nftData.supply,
      image: this._imagesBasePath + path,
      type: nameWrapper.type,
      collection: nftData.collection,
      attributes: nftData.properties,
      videoThumbnail: this._imagesBasePath + videoThumbnail,
    };
  }
}
