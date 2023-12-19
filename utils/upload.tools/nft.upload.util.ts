import {
  UploadToIPFSResponse,
  uploadFileToIPFS,
  uploadMetadataToIPFS,
} from "@/lib/ipfs";
import { INFTData } from "@/pages/marketplace/_components/create.nft.form";
import { NFTMetaData } from "./interfaces/nft.metadata.interface";

export class NFTUploader {
  async uploadMetadata(
    nftData: INFTData,
    file: Blob,
    videoThumbnail?: Blob
  ): Promise<UploadToIPFSResponse> {
    const { ipfs_url: fileIpfsUrl } = await uploadFileToIPFS(file);

    let videoThumbnailIpfsUrl: string | undefined;

    if (videoThumbnail) {
      videoThumbnailIpfsUrl = (await uploadFileToIPFS(videoThumbnail)).ipfs_url;
    }

    const metadata = this.createMetaData(
      nftData,
      fileIpfsUrl,
      file.type,
      videoThumbnailIpfsUrl
    );

    return uploadMetadataToIPFS(metadata);
  }

  private createMetaData(
    nftData: INFTData,
    fileIpfsUrl: string,
    fileType: string,
    videoThumbnailIpfsUrl?: string
  ): NFTMetaData {
    return {
      name: nftData.name,
      description: nftData.description,
      supply: nftData.supply,
      image: fileIpfsUrl,
      type: fileType,
      collection: nftData.collection,
      attributes: nftData.properties,
      videoThumbnail: videoThumbnailIpfsUrl,
    };
  }
}
