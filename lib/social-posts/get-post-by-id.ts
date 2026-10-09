import { Post } from "@/models/post";
import { axiosApi369x } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getPostById = async (
  postId: string,
  isAuthenticated: boolean
): Promise<Post> => {
  try {
    const withAuth =
      isAuthenticated && process.env.NEXT_PUBLIC_APP_ENV !== "development"
        ? "/with-auth"
        : "";

    const response = await axiosApi369x.get<{
      posts: [Post];
    }>(`/api/socials/posts/${postId}${withAuth}?exact_post=true`);

    return response.data.posts[0];
  } catch (error: any) {
    const errorMessage = "Failed to fetch post";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getPostById");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getPostById"
      );
    }
  }
};
