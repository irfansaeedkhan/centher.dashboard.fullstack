import { User } from "./user";

export interface TopCreator {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  createNFTCount: number;
  createCollectionCount: number;
}
