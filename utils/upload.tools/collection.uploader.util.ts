import { ICollectionData } from "@/pages/marketplace/_components/create.collection.form";

import { INFTDetails } from "./interfaces/nft.details.interface";
import { IUploader } from "./interfaces/file.uploader.interface";
import { MoralisUploader } from "./uploaders/moralis.upload.util";
import { ICollectionMetaData } from "./interfaces/collection.metadata.interface";

export class CollectionUploader {
  _uploader: IUploader;
  private _imagesBasePath: string;

  constructor(imagesBasePath: string, uploader?: IUploader) {
    this._imagesBasePath = imagesBasePath;
    if (uploader) {
      this._uploader = uploader;
    } else {
      this._uploader = new MoralisUploader();
    }
  }

  async uploadCollection(
    file: ArrayBuffer,
    collectionData: ICollectionData,
    profileImgPath: string
  ): Promise<INFTDetails> {
    if (!file) {
      throw new Error("invalid file.");
    }

    let assetBuffer = this.toBuffer(file);

    const uploadCoverDto = {
      path: this._uploader.makePath(collectionData),
      content: assetBuffer.toString("base64"),
    };

    const coverImagePath = await this._uploader.upload(uploadCoverDto);
    const metadata = this.createMetaData(
      collectionData,
      coverImagePath,
      profileImgPath
    );
    const metaDataBuffered = this.toBuffer(JSON.stringify(metadata));
    const uploadMetaDataDto = {
      path: this._uploader.makePath(collectionData, "josn"),
      content: metaDataBuffered.toString("base64"),
    };

    const metaDataPath = await this._uploader.upload(uploadMetaDataDto);
    return metaDataPath;
  }

  private toBuffer(input: any): Buffer {
    return Buffer.from(input);
  }

  private createMetaData(
    collectionData: ICollectionData,
    coverPath: string,
    profilePath: string
  ): ICollectionMetaData {
    return {
      name: collectionData.name,
      symbol: collectionData.symbol,
      description: collectionData.description,
      totalsupply: collectionData.totalsupply,
      url: collectionData.url,
      category: collectionData.category,
      yoursite: collectionData.yoursite,
      facebook: collectionData.facebook,
      twitter: collectionData.twitter,
      profileIPFSHash: this._imagesBasePath + profilePath,
      coverIPFSHash: this._imagesBasePath + coverPath,
    };
  }
}
