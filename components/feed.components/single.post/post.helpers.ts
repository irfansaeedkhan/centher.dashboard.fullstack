import { axiosNodeApi } from "@/utils/axios";
import toast from "react-hot-toast";

export const archivePost = async (postId: string) => {
  await axiosNodeApi.patch(`/api/socials/posts/${postId}/archive`);
  toast.success("Post Archived Successfully");
};
