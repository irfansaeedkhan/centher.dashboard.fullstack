import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import axios from "axios";
import toast from "react-hot-toast";

import { PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { SocketIoEvents } from "@/constants/socket-io-events";
import { getPostAndUpdateStores } from "@/utils/create.post/get-post-and-update-stores";

import { useSocketIOStore } from "./socket.io.store";

export interface NewPostStore {
  modalType: ModalType;
  postId: string | null; // Used for editing post
  parentPostId: string | null; // Used for replying to a post

  isModalOpen: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;

  isPostModalLoading: boolean;
  setisPostModalLoading: (isLoading: boolean) => void;

  setSelectedFiles: (files: MediaFile[]) => void;
  addSelectedFiles: (files: SelectedFile[]) => void;
  removeSelectedFile: (fileUuid: string) => void;

  removeEditPostFile: (fileUuid: string) => void;

  postTextMaxLength: 260;
  setPostText: (text: string) => void;
  appendPostText: (text: string) => void;

  createPost: () => Promise<void>;
  posts: INewPost[];
  addNewPost: () => void;
  removePost: (postUuid: string) => void;

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
          isPostModalLoading: false,
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
      addSelectedFiles: (files) =>
        set((state) => {
          const mediaFiles: MediaFile[] = files.map((file, i) => {
            if (file.type === "new") {
              return {
                type: "new",
                index: i,
                uuid: uuid(),
                original: file.original,
                post_uuid: state.posts.at(-1)!.uuid,
              };
            } else {
              return {
                type: "edit",
                uuid: uuid(),
                original: file.original,
                isDeleted: false,
              };
            }
          });

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

      removeSelectedFile: (fileUuid: string) => {
        set((state) => ({
          posts: state.posts.map((post, index) =>
            index === state.posts.length - 1
              ? {
                  ...post,
                  media: post.media.filter((file) => file.uuid !== fileUuid),
                }
              : post
          ),
        }));
      },

      removeEditPostFile: (fileUuid: string) => {
        set((state) => ({
          posts: state.posts.map((post, index) =>
            index === state.posts.length - 1
              ? {
                  ...post,
                  media: post.media.map((file) => {
                    return {
                      ...file,
                      isDeleted: file.uuid === fileUuid,
                    };
                  }),
                }
              : post
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

      removePost: (uuid: string) => {
        set((state) => {
          const posts = state.posts.filter((post) => post.uuid !== uuid);
          return { posts };
        });
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
            const mediaList = postArray.flatMap((post) => {
              return post.media.map((media) => {
                if (media.type === "new") {
                  return {
                    post_uuid: post.uuid,
                    media: {
                      uuid: media.uuid,
                      type: media.original.type,
                      name: media.original.name,
                      size: media.original.size,
                    },
                    index: media.index,
                  };
                } else {
                  return null;
                }
              });
            });

            if (
              mediaList.length === 0 ||
              mediaList.some((media) => media === null)
            ) {
              return;
            }

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

                if (!file || !(file instanceof File)) {
                  return;
                }

                formData.append("file", file);

                return axios.post(url, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
              }
            );

            await Promise.all(mediaUploadPromises);

            const socket = useSocketIOStore.getState().socket;

            if (!socket) return;

            socket.on(
              SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE,
              async (data: { first_post_id: string }) => {
                try {
                  await getPostAndUpdateStores(
                    data.first_post_id,
                    get().modalType
                  );
                  socket.off(SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE);
                  get().closeModal();
                } catch (error: any) {
                  socket.off(SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE);
                  set({ isPostModalLoading: false });
                  customLog("Error in create post: ", ["development"]);
                  customLog(error, ["development"]);
                  if (error.response?.data?.message_description) {
                    toast.error(error.response.data.message_description);
                  } else {
                    toast.error("Something went wrong, please try again later");
                  }
                }
              }
            );
          } else {
            const postToFetchId = response.data.posts[0]._id;
            await getPostAndUpdateStores(postToFetchId, get().modalType);
            get().closeModal();
          }
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
          const { postId, getLastPost } = get();

          const post = getLastPost();

          if (!post || !postId) return;

          if (
            post.post_text.trim() === "" &&
            (!post.media ||
              post.media.filter((f) => f.type === "edit" && f.isDeleted)
                .length === post.media.length)
          ) {
            toast.error("You can not make the post empty");
            return;
          }

          set({ isPostModalLoading: true });

          await axiosNodeApi.patch(`/api/socials/posts/${postId}/edit`, {
            text: post.post_text,
            deleted_media: post.media
              .filter((file) => file.type === "edit" && file.isDeleted)
              .map((file) => file.type === "edit" && file.original.url),
          });

          // If no file media that means only text was available in post
          // await getNewPostAndUpdateState(postId);
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

export interface MediaFileNew {
  type: "new";
  uuid: string;
  post_uuid: string;
  original: File;
  index: number;
}

export interface MediaFileEdit {
  type: "edit";
  uuid: string;
  original: PostMedia;
  isDeleted: boolean;
}

export type MediaFile = MediaFileNew | MediaFileEdit;

interface SelectedFileNew {
  type: "new";
  original: File;
}

interface SelectedFileEdit {
  type: "edit";
  original: PostMedia;
}

export type SelectedFile = SelectedFileNew | SelectedFileEdit;

export type ModalType =
  | null
  | "new-post"
  | "reply-of-thread-post"
  | "reply"
  | "reply-of-reply"
  | "edit";

interface OpenModalOptionsBase {
  onCloseModal?: () => void;
  shouldAddNewPost: boolean;
}

interface OpenModalOptionsCreate extends OpenModalOptionsBase {
  modalType: "new-post";
}

interface OpenModalOptionsReplyOfThreadPost extends OpenModalOptionsBase {
  modalType: "reply-of-thread-post";
  parentPostId: string;
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
  posts: INewPost[];
}

type OpenModalOptions =
  | OpenModalOptionsCreate
  | OpenModalOptionsReplyOfThreadPost
  | OpenModalOptionsReply
  | OpenModalOptionsReplyOfReply
  | OpenModalOptionsEdit;
