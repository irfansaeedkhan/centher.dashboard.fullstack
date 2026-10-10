import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import toast from "react-hot-toast";
import { axiosApi369x } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { MediaFileNew } from "@/components/post-editor/shared/types";
import {
  uploadImage,
  isCloudinaryConfigured,
  CloudinaryNotConfiguredError,
} from "@/lib/media/cloudinary";

export interface ICreatePost {
  uuid: string;
  post_editor_state: SerializedEditorState<SerializedLexicalNode>;
  media: MediaFileNew[];
}

export const createPosts = async ({
  replying_to,
  posts,
}: {
  replying_to: string | null;
  posts: ICreatePost[];
}): Promise<any[]> => {
  try {
    if (posts.length === 0) return [];

    let postsToCreate = posts.map((post) => ({
      uuid: post.uuid,
      post_editor_state: post.post_editor_state,
      media: post.media.map((media) => ({
        uuid: media.uuid,
        object_name: "",
        type: media.original.type,
      })) as {
        uuid?: string;
        object_name: string;
        type: string;
      }[],
    }));

    // If posts have media, upload each file to Cloudinary (Phase 11).
    // If posts have no media, skip this step.
    const hasMedia = posts.some((post) => post.media.length > 0);

    if (hasMedia) {
      if (!isCloudinaryConfigured()) {
        // Honest fallback: no storage configured — post text-only.
        toast.error("Media uploads aren't available yet — posting text only");
      } else {
        const uploadJobs: Promise<void>[] = [];
        posts.forEach((post) => {
          post.media.forEach((media) => {
            const file = media.original;
            if (!(file instanceof File)) return;
            const target = postsToCreate
              .find((p) => p.uuid === post.uuid)
              ?.media.find((m) => m.uuid === media.uuid);
            if (!target) return;
            uploadJobs.push(
              uploadImage(file, "centher/posts").then((secureUrl) => {
                target.object_name = secureUrl;
                delete target.uuid;
              })
            );
          });
        });
        try {
          await Promise.all(uploadJobs);
        } catch (error: any) {
          if (error instanceof CloudinaryNotConfiguredError) {
            toast.error(
              "Media uploads aren't available yet — posting text only"
            );
          } else {
            // Upload failed — post text-only rather than losing the post.
            toast.error(
              error?.message || "Image upload failed — posting text only"
            );
          }
          // Clear any partial uploads so the post goes out text-only.
          postsToCreate.forEach((post) => {
            post.media.forEach((media) => {
              media.object_name = "";
              delete media.uuid;
            });
          });
        }
      }
    }

    // Create posts
    const response = await axiosApi369x.post(`/api/socials/posts`, {
      replying_to,
      posts: postsToCreate,
    });

    return response.data.posts;
  } catch (error: any) {
    const errorMessage = "Failed to post";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "createPosts");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message_description ?? errorMessage,
        "createPosts"
      );
    }
  }
};
