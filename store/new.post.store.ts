import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import axios from "axios";
import toast from "react-hot-toast";
import { EditorState, convertToRaw } from "draft-js";
import { extractHashtagsWithIndices } from "@draft-js-plugins/hashtag";
import cloneDeep from "clone-deep";
import { PostMedia } from "@/models/post";
import { axiosApiCenther } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getPostAndUpdateStores } from "@/utils/create.post";

export interface NewPostStore {
  isModalOpen: boolean;
  modalType: ModalType;

  postId: string | null; // Used for editing post
  parentPostId: string | null; // Used for replying to a post

  editorState: EditorState;
  posts: INewPost[];

  isPostModalLoading: boolean;
  nonCitizenUserPostText: 320;

  actions: {
    openModal: (options: OpenModalOptions) => void;
    closeModal: () => void;
    setEditorState: (editorState: EditorState) => void;
    clearEditorState: () => void;
    setIsPostModalLoading: (isLoading: boolean) => void;
    setSelectedFiles: (files: MediaFile[]) => void;
    addSelectedFiles: (files: SelectedFile[]) => void;
    removeSelectedFile: (fileUuid: string) => void;
    removeEditPostFile: (fileUuid: string) => void;
    setPostText: (text: string) => void;
    createPost: (user: any) => Promise<void>;
    addNewPost: () => void;
    removePost: (postUuid: string) => void;
    editPost: () => Promise<void>;
    onCloseModal: () => void;
    getLastPost: () => INewPost | undefined;
  };
}

export const useNewPostStore = create<NewPostStore>()(
  devtools(
    (set, get) => ({
      isModalOpen: false,
      modalType: null,

      postId: null,
      parentPostId: null,

      editorState: EditorState.createEmpty(),
      posts: [],

      isPostModalLoading: false,
      nonCitizenUserPostText: 320,

      actions: {
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
                  entities: {
                    mentions: [],
                    hashtags: [],
                  },
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
          get().actions.clearEditorState();
          if (get().actions.onCloseModal) {
            get().actions.onCloseModal();
          }
          set((prev) => ({
            ...prev,
            actions: {
              ...prev.actions,
              onCloseModal: () => {},
            },
          }));
        },

        onCloseModal: () => {},

        setEditorState: (editorState) => {
          set({ editorState });
        },

        clearEditorState: () => {
          get().actions.setEditorState(EditorState.createEmpty());
        },

        setIsPostModalLoading: (isLoading) =>
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
            let mediaFiles: MediaFile[] = [];

            mediaFiles = files.map((file, i) => {
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
            const posts = state.posts.map((post, index) => {
              if (index !== state.posts.length - 1) {
                return post;
              }
              if (
                mediaFiles[0].original.type.startsWith("video") &&
                post.media[0]?.original.type.startsWith("video")
              ) {
                return {
                  ...post,
                  media: [mediaFiles[0]],
                };
              }
              if (post.media[0]?.original.type.startsWith("video")) {
                return post;
              }
              if (
                mediaFiles[0].original.type.startsWith("video") &&
                post.media[0]?.original.type.startsWith("image")
              ) {
                return post;
              }
              return {
                ...post,
                media: [...post.media, ...mediaFiles],
              };
            });
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
                      if (fileUuid === file.uuid) {
                        return {
                          ...file,
                          isDeleted: true,
                        };
                      } else {
                        return file;
                      }
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

        createPost: async (user) => {
          try {
            // Exclude the last post if it is empty
            let postArray = cloneDeep(get().posts);

            if (
              postArray.at(-1)?.post_text.trim() === "" &&
              postArray.at(-1)?.media.length === 0
            ) {
              postArray = cloneDeep(get().posts.slice(0, -1));
            }

            // Every post should have either post_text or media
            if (
              postArray.every(
                (post) =>
                  post.post_text.trim() === "" && post.media.length === 0
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

            let maxPostTextLength: number;
            if (user.membership.status !== "citizen") {
              maxPostTextLength = get().nonCitizenUserPostText;
            } else {
              maxPostTextLength = Infinity;
            }

            if (
              postArray.some(
                (post) => post.post_text.trim().length > maxPostTextLength
              )
            ) {
              toast.error(
                `Post text should not be more than ${maxPostTextLength} characters`
              );
              return;
            }

            set({ isPostModalLoading: true });

            const lastPost = postArray.at(-1)!;
            const editorState = get().editorState;
            const rawEditorContent = convertToRaw(
              editorState.getCurrentContent()
            );
            const entityMap = Object.values(rawEditorContent.entityMap);

            // TODO: the indices sometimes ignore the spaces, we need to fix it
            let entityRanges = [];
            let textLength = 0;
            let c = 0;
            for (let i = 0; i < rawEditorContent.blocks.length; i++) {
              if (i > 0) {
                textLength =
                  textLength + rawEditorContent.blocks[i - 1].text.length + 1;
                if (rawEditorContent.blocks[i].entityRanges.length <= 0) {
                  continue;
                }
                let totalEmoji = 0;
                for (
                  let j = 0;
                  j < rawEditorContent.blocks[i].entityRanges.length;
                  j++
                ) {
                  if (entityMap[c + j]?.type == "emoji") {
                    totalEmoji++;
                    continue;
                  }
                  entityRanges.push({
                    offset:
                      rawEditorContent.blocks[i].entityRanges[j].offset +
                      textLength +
                      totalEmoji,
                    length:
                      rawEditorContent.blocks[i].entityRanges[j].length + 1,
                    key: rawEditorContent.blocks[i].entityRanges[j].key,
                  });
                  c = c + j;
                }
              } else {
                let totalEmoji = 0;

                for (
                  let j = 0;
                  j < rawEditorContent.blocks[i].entityRanges.length;
                  j++
                ) {
                  c++;
                  if (entityMap[j]?.type == "emoji") {
                    totalEmoji++;
                    continue;
                  }
                  entityRanges.push({
                    offset:
                      rawEditorContent.blocks[i].entityRanges[j].offset +
                      totalEmoji,
                    length: rawEditorContent.blocks[i].entityRanges[j].length,
                    key: rawEditorContent.blocks[i].entityRanges[j].key,
                  });
                }
              }
            }

            for (let i = 0, j = 0; i < entityMap.length; i++) {
              if (entityMap[i]?.type == "emoji") {
                continue;
              }
              lastPost.entities.mentions.push({
                user_id: entityMap[i].data.mention.id,
                display_name: entityMap[i].data.mention.name,
                indices: [
                  entityRanges[j].offset,
                  entityRanges[j].offset + entityRanges[j].length,
                ],
              });
              j++;
            }

            extractHashtagsWithIndices(lastPost.post_text).map((data) => {
              lastPost.entities.hashtags.push({
                text: data.hashtag,
                indices: data.indices,
              });
            });

            const response = await axiosApiCenther.post(`/api/socials/posts`, {
              replying_to: get().parentPostId,
              posts: postArray.map((post) => ({
                uuid: post.uuid,
                post_text: post.post_text,
                media_count: post.media.length,
                entities: post.entities,
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
              } = await axiosApiCenther.post(
                `/api/socials/posts/media/presigned-urls`,
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

              // FIXME: this is quick fix, need to find a better way to do this
              const postToFetchId = response.data.posts[0]._id;
              let count = 0;
              const interval = setInterval(async () => {
                count++;
                const isDone = await getPostAndUpdateStores({
                  parentPostId: get().parentPostId,
                  postId: postToFetchId,
                  newPostsCount: postArray.length,
                  modalType: get().modalType,
                  isAuthenticated: true,
                });
                if (isDone || count >= 5) {
                  get().actions.closeModal();
                  clearInterval(interval);
                }
              }, 5000);

              // const socket = useSocketIOStore.getState().socket;

              // if (!socket) return;

              // socket.on(
              //   SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE,
              //   async (data: { first_post_id: string }) => {
              //     try {
              //       await getPostAndUpdateStores({
              //         parentPostId: get().parentPostId,
              //         postId: data.first_post_id,
              //         newPostsCount: postArray.length,
              //         modalType: get().modalType,
              //         isAuthenticated: true,
              //       });
              //       socket.off(SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE);
              //       get().closeModal();
              //     } catch (error: any) {
              //       socket.off(SocketIoEvents.POST_MEDIA_UPLOAD_COMPLETE);
              //       set({ isPostModalLoading: false });
              //       customLog(["development"], "Error in create post: ", error);
              //       if (error.response?.data?.message_description) {
              //         toast.error(error.response.data.message_description);
              //       } else {
              //         toast.error("Something went wrong, please try again later");
              //       }
              //     }
              //   }
              // );
            } else {
              const postToFetchId = response.data.posts[0]._id;
              await getPostAndUpdateStores({
                parentPostId: get().parentPostId,
                postId: postToFetchId,
                newPostsCount: postArray.length,
                modalType: get().modalType,
                isAuthenticated: true,
              });
              get().actions.closeModal();
            }
          } catch (error: any) {
            set({ isPostModalLoading: false });
            customLog(
              ["development", "staging"],
              "Error in create post: ",
              error
            );
            if (error.response?.data?.message_description) {
              toast.error(error.response.data.message_description);
            } else {
              toast.error("Something went wrong, please try again later");
            }
          }
        },

        getLastPost: () => get().posts.at(-1),

        addNewPost: () => {
          // Check if the last post is empty
          if (
            get().posts.at(-1)?.post_text.trim() === "" &&
            get().posts.at(-1)?.media.length === 0
          ) {
            return;
          }

          // Extract mentions and hashtags from the editorState and put them in the entities of last post
          const lastPost = get().posts.at(-1);
          const mentions: PostMention[] = [];
          const hashtags: PostHashtag[] = [];

          if (lastPost) {
            const editorState = get().editorState;
            const rawEditorContent = convertToRaw(
              editorState.getCurrentContent()
            );
            const entityMap = Object.values(rawEditorContent.entityMap);

            const entityRanges = [];
            let textLength = 0;
            for (let i = 0; i < rawEditorContent.blocks.length; i++) {
              if (i > 0) {
                textLength =
                  textLength + rawEditorContent.blocks[i - 1].text.length + 1;
                if (rawEditorContent.blocks[i].entityRanges.length <= 0) {
                  continue;
                }

                for (
                  let j = 0;
                  j < rawEditorContent.blocks[i].entityRanges.length;
                  j++
                ) {
                  entityRanges.push({
                    offset:
                      rawEditorContent.blocks[i].entityRanges[j].offset +
                      textLength,
                    length:
                      rawEditorContent.blocks[i].entityRanges[j].length + 1,
                    key: rawEditorContent.blocks[i].entityRanges[j].key,
                  });
                }
              } else {
                for (
                  let j = 0;
                  j < rawEditorContent.blocks[i].entityRanges.length;
                  j++
                ) {
                  entityRanges.push(rawEditorContent.blocks[i].entityRanges[j]);
                }
              }
            }

            for (let i = 0; i < entityMap.length; i++) {
              mentions.push({
                user_id: entityMap[i].data.mention.id,
                display_name: entityMap[i].data.mention.name,
                indices: [
                  entityRanges[i].offset,
                  entityRanges[i].offset + entityRanges[i].length,
                ],
              });
            }

            extractHashtagsWithIndices(lastPost.post_text).map((data) => {
              hashtags.push({
                text: data.hashtag,
                indices: data.indices,
              });
            });
          }

          const posts = [
            ...get().posts.map((post, index) =>
              index === get().posts.length - 1
                ? {
                    ...post,
                    entities: {
                      mentions,
                      hashtags,
                    },
                  }
                : post
            ),
            {
              uuid: uuid(),
              post_text: "",
              media: [],
              entities: {
                mentions: [],
                hashtags: [],
              },
            },
          ];

          get().actions.clearEditorState();
          set({ posts });
        },

        removePost: (uuid: string) => {
          set((state) => {
            const posts = state.posts.filter((post) => post.uuid !== uuid);
            return { posts };
          });
        },

        editPost: async () => {
          try {
            const { postId } = get();
            const { getLastPost } = get().actions;

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

            await axiosApiCenther.patch(`/api/socials/posts/${postId}/edit`, {
              text: post.post_text,
              deleted_media: post.media
                .filter((file) => file.type === "edit" && file.isDeleted)
                .map((file) => file.type === "edit" && file.original.url),
            });

            // If no file media that means only text was available in post
            await getPostAndUpdateStores({
              modalType: get().modalType,
              parentPostId: get().parentPostId,
              postId,
              newPostsCount: 0, // we are only editing the post, not creating new
              isAuthenticated: true,
            });
            get().actions.closeModal();
            return;
          } catch (error: any) {
            set({ isPostModalLoading: false });
            customLog(["development"], "Error in edit post: ", error);
          }
        },
      },
    }),
    {
      name: "NewPostStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);

interface PostMention {
  user_id: string;
  display_name: string;
  indices: [number, number];
}

interface PostHashtag {
  text: string;
  indices: [number, number];
}

interface PostEntities {
  mentions: PostMention[];
  hashtags: PostHashtag[];
}

export interface INewPost {
  uuid: string;
  post_text: string;
  media: MediaFile[];
  entities: PostEntities;
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
