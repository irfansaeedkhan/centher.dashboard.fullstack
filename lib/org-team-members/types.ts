import { User } from "@/models/user";

export type OrgMember = {
  user_id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  title: string;
  joined_at: string;
};

export type PendingInvite = {
  _id: string;
  org: {
    _id: User["_id"];
    display_name: User["display_name"];
    profile_image: User["profile_image"];
    membership: User["membership"];
  };
  user: {
    _id: User["_id"];
    display_name: User["display_name"];
    profile_image: User["profile_image"];
    membership: User["membership"];
  };
  title: string;
  invited_at: string;
};
