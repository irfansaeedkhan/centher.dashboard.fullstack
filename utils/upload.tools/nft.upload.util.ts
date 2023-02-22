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
    nameWrapper: safeNameType
  ): Promise<INFTDetails> {
    if (!file) {
      throw new Error("invalid file.");
    }

    const uploadImageDto = {
      path: this._uploader.makePath(),
      content: file.toString("base64"),
    };

    const imagePath = await this._uploader.upload(uploadImageDto);
    const metadata = this.createMetaData(nftData, imagePath, nameWrapper);
    const metaDataBuffered = this.toBuffer(JSON.stringify(metadata));
    const uploadMetaDataDto = {
      path: this._uploader.makePath("json"),
      content: metaDataBuffered.toString("base64"),
    };

    const metaDataPath = await this._uploader.upload(uploadMetaDataDto);
    return metaDataPath;
  }

  private toBuffer(input: any): Buffer {
    return Buffer.from(input);
  }

  private createMetaData(
    nftData: INFTData,
    path: string,
    nameWrapper: safeNameType
  ): NFTMetaData {
    return {
      name: nftData.name,
      description: nftData.description,
      supply: nftData.supply,
      image: this._imagesBasePath + path,
      type: nameWrapper.type,
      collection: nftData.collection,
      attributes: nftData.properties,
    };
  }
}
