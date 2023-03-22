import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

import { PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import {
  createFilesChunks,
  getNewPostAndUpdateState,
  uploadFiles,
} from "@/utils/create.post";
import { v4 as uuid } from "uuid";

interface SelectedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}
export interface NewPostStore {
  modalType: ModalType;
  postId: string | null; // Used for editing post
  parentPostId: string | null; // Used for replying to a post

  isModalOpen: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;

  isPostModalLoading: boolean;
  setisPostModalLoading: (isLoading: boolean) => void;

  selectedFiles: FileWithID[];
  setSelectedFiles: (files: MediaFile[]) => void;
  addSelectedFiles: (files: File[]) => void;
  removeSelectedFile: (fileUuid: string) => void;

  editPostFiles?: EditMediaFile[];
  removeEditPostFile: (fileId: string) => void;

  postTextMaxLength: 260;
  setPostText: (text: string) => void;
  appendPostText: (text: string) => void;

  createPost: () => Promise<void>;
  posts: INewPost[];
  addNewPost: () => void;

  editPost: () => Promise<void>;

  onCloseModal: () => void;

  getLastPost: () => INewPost | undefined;
}

export const useNewPostStore = create<NewPostStore>()(
  devtools(
    (set, get) => ({
      modalType: null,
      postId: null,
      parentPostId: null,
      posts: [],
      isModalOpen: false,
      postTextMaxLength: 260,

      openModal: (options) => {
        // Hide scroll bar
        document.body.style.overflow = "hidden";
        if (options.shouldAddNewPost) {
          set({
            isModalOpen: true,
            posts: [
              {
                uuid: uuid(),
                post_text: "",
                media: [],
              },
            ],
            ...options,
          });
        } else {
          set({
            isModalOpen: true,
            ...options,
          });
        }
      },

      closeModal: () => {
        // Show scroll bar
        document.body.style.overflow = "auto";
        set({
          modalType: null,
          parentPostId: null,
          postId: null,
          isModalOpen: false,
          selectedFiles: [],
          isPostModalLoading: false,
          editPostFiles: undefined,
          posts: [],
        });
        if (get().onCloseModal) {
          get().onCloseModal();
        }
        set({ onCloseModal: () => {} });
      },

      onCloseModal: () => {},

      getLastPost: () => get().posts.at(-1),

      isPostModalLoading: false,
      setisPostModalLoading: (isLoading) =>
        set({ isPostModalLoading: isLoading }),

      selectedFiles: [],
      setSelectedFiles: (files: MediaFile[]) => {
        set({
          posts: get().posts.map((post, index) =>
            index === get().posts.length - 1
              ? {
                  ...post,
                  media: files,
                }
              : post
          ),
        });
      },
      addSelectedFiles: (files: File[]) =>
        set((state) => {
          const mediaFiles: MediaFile[] = files.map((file, i) => ({
            uuid: uuid(),
            post_uuid: state.posts.at(-1)!.uuid,
            original: file,
            index: i,
          }));

          // Add files to the last post
          const posts = state.posts.map((post, index) =>
            index === state.posts.length - 1
              ? {
                  ...post,
                  media: [...post.media, ...mediaFiles],
                }
              : post
          );
          return { posts };
        }),

      removeSelectedFile: (fileId: string) => {
        set((state) => ({
          posts: state.posts.map((post, index) =>
            index === state.posts.length - 1
              ? {
                  ...post,
                  media: post.media.filter((file) => file.uuid !== fileId),
                }
              : post
          ),
        }));
      },

      editPostFiles: undefined,
      removeEditPostFile: (fileId: string) => {
        set((state) => ({
          editPostFiles: state.editPostFiles?.map((file) =>
            file.uuid === fileId ? { ...file, isDeleted: true } : file
          ),
        }));
      },

      setPostText: (text: string) => {
        set({
          posts: get().posts.map((post, index) =>
            index === get().posts.length - 1
              ? {
                  ...post,
                  post_text: text,
                }
              : post
          ),
        });
      },

      appendPostText: (text: string) => {
        set({
          posts: get().posts.map((post, index) =>
            index === get().posts.length - 1
              ? {
                  ...post,
                  post_text: post.post_text + text,
                }
              : post
          ),
        });
      },

      addNewPost: () => {
        // Check if the last post is empty
        if (
          get().posts.at(-1)?.post_text.trim() === "" &&
          get().posts.at(-1)?.media.length === 0
        ) {
          return;
        }

        const posts = [
          ...get().posts,
          {
            uuid: uuid(),
            post_text: "",
            media: [],
          },
        ];

        set({ posts });
      },

      createPost: async () => {
        try {
          // Exclude the last post if it is empty
          let postArray = [...get().posts];

          if (
            get().posts.at(-1)?.post_text.trim() === "" &&
            get().posts.at(-1)?.media.length === 0
          ) {
            postArray = get().posts.slice(0, -1);
          }

          // Every post should have either post_text or media
          if (
            postArray.every(
              (post) => post.post_text.trim() === "" && post.media.length === 0
            )
          ) {
            toast.error("Post should have either text or media");
            return;
          }

          // Check if any post has greater than 5 media
          if (postArray.some((post) => post.media.length > 5)) {
            toast.error("Post should have maximum 5 media");
            return;
          }

          // Check if the post text is more than 260 characters
          if (
            postArray.some(
              (post) => post.post_text.trim().length > get().postTextMaxLength
            )
          ) {
            toast.error(
              `Post text should not be more than ${
                get().postTextMaxLength
              } characters`
            );
            return;
          }

          set({ isPostModalLoading: true });

          const response = await axiosNodeApi.post(`/api/socials/posts/v2`, {
            replying_to: get().parentPostId,
            posts: postArray.map((post) => ({
              uuid: post.uuid,
              post_text: post.post_text,
              media_count: post.media.length,
            })),
          });

          if (response.data.shouldUploadMedia) {
            const mediaList = postArray.flatMap((post) =>
              post.media.map((media) => ({
                post_uuid: post.uuid,
                media: {
                  uuid: media.uuid,
                  type: media.original.type,
                  name: media.original.name,
                  size: media.original.size,
                },
                index: media.index,
              }))
            );

            const {
              data: { presignedUrls },
            } = await axiosNodeApi.post(
              `/api/socials/posts/v2/media/presigned-urls`,
              {
                media_list: mediaList,
              }
            );

            const mediaUploadPromises = presignedUrls.map(
              (presignedUrl: any) => {
                const fields = presignedUrl.media.presigned_data.fields;
                const url = presignedUrl.media.presigned_data.url;

                const formData = new FormData();
                Object.keys(fields).forEach((key) => {
                  formData.append(key, fields[key]);
                });
                // Actual file has to be appended last.
                const file = postArray
                  .find((post) => post.uuid === presignedUrl.post_uuid)
                  ?.media.find((media) => {
                    return media.uuid === presignedUrl.media.uuid;
                  })?.original;

                if (!file) return;

                formData.append("file", file);

                return axios.post(url, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
              }
            );

            await Promise.all(mediaUploadPromises);
          }

          get().closeModal();
        } catch (error: any) {
          set({ isPostModalLoading: false });
          customLog("Error in create post: ", ["development"]);
          customLog(error, ["development"]);
          if (error.response?.data?.message_description) {
            toast.error(error.response.data.message_description);
          } else {
            toast.error("Something went wrong, please try again later");
          }
        }
      },

      editPost: async () => {
        try {
          // TODO: Handle edit post
          // const { postText, editPostFiles, postId } = get();

          // if (
          //   postText.trim() === "" &&
          //   (!editPostFiles ||
          //     editPostFiles.filter((f) => f.isDeleted).length ===
          //       editPostFiles.length)
          // ) {
          //   toast.error("You can not make the post empty");
          //   return;
          // }

          // set({ isPostModalLoading: true });

          // await axiosNodeApi.patch(`/api/socials/posts/${postId}/edit`, {
          //   text: postText,
          //   deleted_media: editPostFiles
          //     ?.filter((file) => file.isDeleted)
          //     .map((file) => file.original.url),
          // });

          // // If no file media that means only text was available in post
          // await getNewPostAndUpdateState(postId!);
          get().closeModal();
          return;
        } catch (error: any) {
          set({ isPostModalLoading: false });
          customLog("Error in edit post: ", ["development"]);
          customLog(error, ["development"]);
        }
      },
    }),
    { name: "NewPostStore" }
  )
);

export interface INewPost {
  uuid: string;
  post_text: string;
  media: MediaFile[];
}

export interface FileWithID {
  original: File;
  id: string;
}

export interface MediaFile {
  uuid: string;
  post_uuid: string;
  original: File;
  index: number;
}

export type EditMediaFile = {
  original: PostMedia;
  uuid: string;
  post_uuid: string;
  isDeleted: boolean;
};

type ModalType = null | "new-post" | "reply" | "reply-of-reply" | "edit";

interface OpenModalOptionsBase {
  onCloseModal?: () => void;
  shouldAddNewPost: boolean;
}

interface OpenModalOptionsCreate extends OpenModalOptionsBase {
  modalType: "new-post";
}

interface OpenModalOptionsReply extends OpenModalOptionsBase {
  modalType: "reply";
  parentPostId: string;
}

interface OpenModalOptionsReplyOfReply extends OpenModalOptionsBase {
  modalType: "reply-of-reply";
  parentPostId: string;
}

interface OpenModalOptionsEdit extends OpenModalOptionsBase {
  modalType: "edit";
  postId: string;
  editPostFiles?: EditMediaFile[];
  postText?: string;
}

type OpenModalOptions =
  | OpenModalOptionsCreate
  | OpenModalOptionsReply
  | OpenModalOptionsReplyOfReply
  | OpenModalOptionsEdit;
