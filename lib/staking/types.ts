import { User } from "@/models/user";

export interface AutoRestakeStatus {
  _id: User["_id"];
  auto_restake: number[]; // Array of pool ids for which auto restake is enabled
}
