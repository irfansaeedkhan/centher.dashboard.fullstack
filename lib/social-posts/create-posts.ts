import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import axios from "axios";
import { axiosApi369x } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { MediaFileNew } from "@/components/post-editor/shared/types";

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

    // If posts have media, create presigned url for each media and upload them to S3
    // If posts have no media, skip this step
    const hasMedia = posts.some((post) => post.media.length > 0);

    const presignedUrls: any[] = [];

    if (hasMedia) {
      const mediaList = posts
        .map((post) =>
          post.media.map((media) => ({
            post_uuid: post.uuid,
            media: {
              uuid: media.uuid,
              type: media.original.type,
              name: media.original.name,
              size: media.original.size,
              index: media.index,
            },
          }))
        )
        .flat();

      const response = await axiosApi369x.post(
        `/api/socials/posts/media/presigned-urls`,
        {
          media_list: mediaList,
        }
      );

      presignedUrls.push(...response.data.presignedUrls);
    }

    if (presignedUrls.length > 0) {
      // Upload media to S3
      const mediaUploadPromises = presignedUrls.map(async (presignedUrl) => {
        const fields = presignedUrl.media.presigned_data.fields;
        const url = presignedUrl.media.presigned_data.url;

        const formData = new FormData();

        Object.keys(fields).forEach((key) => {
          formData.append(key, fields[key]);
        });

        // Actual file has to be appended last.
        const file = posts
          .find((post) => post.uuid === presignedUrl.post_uuid)
          ?.media.find((media) => {
            return media.uuid === presignedUrl.media.uuid;
          })?.original;

        if (!file || !(file instanceof File)) {
          return;
        }

        formData.append("file", file);

        return axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      await Promise.all(mediaUploadPromises);

      // Update media objects in posts
      postsToCreate.forEach((post) => {
        post.media.forEach((media) => {
          media.object_name = presignedUrls.find(
            (presignedUrl) =>
              presignedUrl.post_uuid === post.uuid &&
              presignedUrl.media.uuid === media.uuid
          )?.media.object_name;
          delete media.uuid;
        });
      });
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
