import { IProperty } from "@/pages/marketplace/_components/create.nft.form";

export interface NFTMetaData {
  name: string;
  description: string;
  supply: number;
  image: string;
  type: any;
  collection: string;
  attributes: IProperty[];
}
