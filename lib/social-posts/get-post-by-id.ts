import { Post } from "@/models/post";
import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getPostById = async (
  postId: string,
  isAuthenticated: boolean
): Promise<Post> => {
  try {
    let url = `/api/socials/posts/${postId}`;

    if (isAuthenticated && process.env.NEXT_PUBLIC_APP_ENV !== "development") {
      url += "/with-auth";
    }

    const response = await axiosApiCenther.get<{
      posts: [Post];
    }>(`${url}?exact_post=true`);

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
