import {
  UploadToIPFSResponse,
  uploadFileToIPFS,
  uploadMetadataToIPFS,
} from "@/lib/ipfs";
import { ICollectionData } from "@/pages/marketplace/_components/create.collection.form";
import { ICollectionMetaData } from "./interfaces/collection.metadata.interface";

export class CollectionUploader {
  async uploadFiles(
    profile: Blob,
    cover: Blob
  ): Promise<{
    profile: UploadToIPFSResponse;
    cover: UploadToIPFSResponse;
  }> {
    const [profileUploadRes, coverUploadRes] = await Promise.all([
      uploadFileToIPFS(profile),
      uploadFileToIPFS(cover),
    ]);

    return {
      profile: profileUploadRes,
      cover: coverUploadRes,
    };
  }

  async uploadMetadata(
    collectionData: ICollectionData,
    uploadedFiles: Awaited<ReturnType<typeof this.uploadFiles>>
  ): Promise<UploadToIPFSResponse> {
    const metadata = this.createMetaData(
      collectionData,
      uploadedFiles.profile.ipfs_url,
      uploadedFiles.cover.ipfs_url
    );

    return uploadMetadataToIPFS(metadata);
  }

  private createMetaData(
    collectionData: ICollectionData,
    profileIpfsUrl: string,
    coverIpfsUrl: string
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
      profileIPFSHash: profileIpfsUrl,
      coverIPFSHash: coverIpfsUrl,
    };
  }
}
