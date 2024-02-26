import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LexicalEditor } from "lexical";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import {
  IEditorPost,
  MediaFile,
  SelectedFile,
} from "@/components/post-editor/shared/types";
import { getPostAndUpdateStores } from "@/components/post-editor/utils";
import { LoggedInUser } from "@/models/user";
import { ICreatePost, createPosts } from "@/lib/social-posts";

export interface PostEditorStore {
  isModalOpen: boolean;
  modalType: ModalType;
  posts: IEditorPost[];
  lastActivePostUUID: string | null;
  isSubmitting: boolean;
  NON_CITIZEN_POST_TEXT_LENGTH: number;

  parentPostId: string | null; // Used for replying to a post

  actions: {
    openModal: (options: OpenModalOptions) => void;
    closeModal: () => void;
    onCloseModal: () => void;
    getLastPost: () => IEditorPost | undefined;
    getLastActivePost: () => IEditorPost | undefined;
    setLastActivePost: (postUUID: string) => void;
    createPosts: (user: LoggedInUser) => Promise<void>;
    addNewPost: () => void;
    removePost: (postUUID: string) => void;
    addSelectedFiles: (files: SelectedFile[]) => void;
    setSelectedFiles: (files: MediaFile[]) => void;
    removeSelectedFile: (postUUID: string, fileUUID: string) => void;
    removeEditPostFile: (postUUID: string, fileUUID: string) => void;
    setEditorRef: (postUUID: string, editorRef: LexicalEditor) => void;
    setTextContentLength: (postUUID: string, length: number) => void;
    isAnyPostEmpty: () => boolean;
    isPostEmpty: (postUUID: string) => boolean;
    isCitizenshipRequiredByAnyPost: (user: LoggedInUser) => boolean;
    isCitizenshipRequired: (postUUID: string, user: LoggedInUser) => boolean;
  };
}

export const usePostEditorStore = create<PostEditorStore>()(
  devtools(
    (set, get) => ({
      isModalOpen: false,
      modalType: null,
      posts: [],
      lastActivePostUUID: null,
      isSubmitting: false,
      NON_CITIZEN_POST_TEXT_LENGTH: 320,

      parentPostId: null,

      actions: {
        openModal: (options) => {
          // Hide scroll bar
          document.body.style.overflow = "hidden";

          if (options.shouldAddNewPost) {
            const postUUID = uuidv4();
            set({
              isModalOpen: true,
              lastActivePostUUID: postUUID,
              posts: [
                {
                  uuid: postUUID,
                  media: [],
                  text_content_length: 0,
                  editorRef: null,
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

          const onCloseModal = get().actions.onCloseModal;

          set((prev) => ({
            ...prev,
            isModalOpen: false,
            modalType: null,
            posts: [],
            lastActivePostUUID: null,
            isSubmitting: false,
            shouldAddNewPost: false,
            parentPostId: null,
            actions: {
              ...prev.actions,
              onCloseModal: () => {},
            },
          }));

          if (onCloseModal) {
            onCloseModal();
          }
        },

        onCloseModal: () => {},

        getLastPost: () => get().posts.at(-1),

        getLastActivePost: () => {
          return get().posts.find(
            (post) => post.uuid === get().lastActivePostUUID
          );
        },

        setLastActivePost: (postUUID: string) => {
          set({ lastActivePostUUID: postUUID });
        },

        createPosts: async (user) => {
          // Is any post empty?
          if (get().actions.isAnyPostEmpty()) {
            toast.error("Post should have either text or media");
            return;
          }
          // Is citizenship required by any post?
          if (get().actions.isCitizenshipRequiredByAnyPost(user)) {
            toast.error("Become a citizen to access citizen only features");
            return;
          }

          set({ isSubmitting: true });

          // add post editor state to the post
          const posts: ICreatePost[] = get()
            .posts.map((post) => {
              if (!post.editorRef) {
                return null;
              }
              return {
                uuid: post.uuid,
                media: post.media,
                post_editor_state: post.editorRef.getEditorState().toJSON(),
              };
            })
            .filter((post) => post !== null) as ICreatePost[];

          try {
            // Upload Media and Create Posts in DB
            const newPosts = await createPosts({
              replying_to: get().parentPostId,
              posts,
            });

            await getPostAndUpdateStores({
              modalType: get().modalType,
              parentPostId: get().parentPostId,
              postId: newPosts[0]._id,
              newPostsCount: newPosts.length,
              isAuthenticated: true,
            });

            // Reset post editor state after successful post creation
            get().actions.closeModal();
          } catch (err: any) {
            toast.error(err.message);
          } finally {
            set({ isSubmitting: false });
          }
        },

        addNewPost: () => {
          const posts = [...get().posts];
          const lastActivePost = get().actions.getLastActivePost();

          const postUUID = uuidv4();

          const newPost: IEditorPost = {
            uuid: postUUID,
            media: [],
            text_content_length: 0,
            editorRef: null,
          };

          // If modal is open, then add new post after the last active post
          // else add new post at the end, i.e. when selecting media from create post card
          if (lastActivePost) {
            if (
              lastActivePost.text_content_length === 0 &&
              lastActivePost.media.length === 0
            ) {
              // Check if the last active post is empty
              return;
            }

            const lastActivePostIndex = posts.findIndex(
              (post) => post.uuid === get().lastActivePostUUID
            );

            if (lastActivePostIndex === -1) {
              return;
            }

            // Insert new post after the last active post and shift the rest
            posts.splice(lastActivePostIndex + 1, 0, newPost);
          } else {
            // Insert new post at the end
            posts.push(newPost);
          }

          set((prev) => ({
            ...prev,
            lastActivePostUUID: postUUID,
            posts,
          }));
        },

        removePost: (postUUID) => {
          const posts = [...get().posts];
          const postIndex = posts.findIndex((post) => post.uuid === postUUID);

          if (postIndex === -1) {
            return;
          }

          posts.splice(postIndex, 1);

          if (posts[postIndex - 1]) {
            get().actions.setLastActivePost(posts[postIndex - 1].uuid);
          } else if (posts[postIndex]) {
            get().actions.setLastActivePost(posts[postIndex].uuid);
          }

          set({ posts });
        },

        addSelectedFiles: (files) => {
          const posts = [...get().posts];

          const lastActivePostIndex = posts.findIndex(
            (post) => post.uuid === get().lastActivePostUUID
          );

          if (lastActivePostIndex === -1) {
            return;
          }

          const mediaFiles: MediaFile[] = files.map((file, i) => {
            if (file.type === "new") {
              return {
                type: "new",
                index: i,
                uuid: uuidv4(),
                original: file.original,
                post_uuid: posts[lastActivePostIndex].uuid,
              };
            } else {
              return {
                type: "edit",
                uuid: uuidv4(),
                original: file.original,
                isDeleted: false,
              };
            }
          });

          let updatedLastActivePost = {
            ...posts[lastActivePostIndex],
          };

          if (
            mediaFiles[0].original.type.startsWith("video") &&
            updatedLastActivePost.media[0]?.original.type.startsWith("video")
          ) {
            updatedLastActivePost.media = [mediaFiles[0]];
          } else if (
            updatedLastActivePost.media[0]?.original.type.startsWith("video")
          ) {
            updatedLastActivePost = updatedLastActivePost;
          } else if (
            mediaFiles[0].original.type.startsWith("video") &&
            updatedLastActivePost.media[0]?.original.type.startsWith("image")
          ) {
            updatedLastActivePost = updatedLastActivePost;
          } else {
            updatedLastActivePost.media = [
              ...updatedLastActivePost.media,
              ...mediaFiles,
            ];
          }

          posts[lastActivePostIndex] = updatedLastActivePost;

          set({ posts });
        },

        setSelectedFiles: (files: MediaFile[]) => {
          const posts = [...get().posts];
          const lastActivePostIndex = posts.findIndex(
            (post) => post.uuid === get().lastActivePostUUID
          );

          if (lastActivePostIndex === -1) {
            return;
          }

          const lastActivePost = { ...posts[lastActivePostIndex] };

          //  FIXME: I guess we are mutating the state here which is not good
          lastActivePost.media = files;

          posts[lastActivePostIndex] = lastActivePost;

          set({ posts });
        },

        removeSelectedFile: (postUUID, fileUUID) => {
          const posts = [...get().posts];
          const updatedPostIndex = posts.findIndex(
            (post) => post.uuid === postUUID
          );

          if (updatedPostIndex === -1) {
            return;
          }

          const updatedPost = { ...posts[updatedPostIndex] };

          updatedPost.media = updatedPost.media.filter(
            (file) => file.uuid !== fileUUID
          );

          posts[updatedPostIndex] = updatedPost;

          set({ posts });
        },

        removeEditPostFile: (postUUID, fileUUID) => {
          const posts = [...get().posts];
          const updatedPostIndex = posts.findIndex(
            (post) => post.uuid === postUUID
          );

          if (updatedPostIndex === -1) {
            return;
          }

          const updatedPost = { ...posts[updatedPostIndex] };

          updatedPost.media = updatedPost.media.map((file) => {
            if (fileUUID === file.uuid) {
              return {
                ...file,
                isDeleted: true,
              };
            } else {
              return file;
            }
          });

          posts[updatedPostIndex] = updatedPost;

          set({ posts });
        },

        setEditorRef: (postUUID, editorRef) => {
          set({
            posts: get().posts.map((post) => {
              if (post.uuid === postUUID) {
                return {
                  ...post,
                  editorRef,
                };
              }
              return post;
            }),
          });
        },

        setTextContentLength: (postUUID, length) => {
          const posts = [...get().posts];
          const postIndex = posts.findIndex((post) => post.uuid === postUUID);

          if (postIndex === -1) {
            return;
          }

          const post = { ...posts[postIndex] };
          if (post.text_content_length === length) {
            return;
          }
          post.text_content_length = length;
          posts[postIndex] = post;
          set({
            posts,
          });
        },

        isPostEmpty: (postUUID) => {
          const post = get().posts.find((post) => post.uuid === postUUID);
          if (!post) {
            return false;
          }
          return post.text_content_length === 0 && post.media.length === 0;
        },

        isAnyPostEmpty: () => {
          return get().posts.some((post) => {
            return get().actions.isPostEmpty(post.uuid);
          });
        },

        isCitizenshipRequiredByAnyPost: (user) => {
          return get().posts.some((post) => {
            return get().actions.isCitizenshipRequired(post.uuid, user);
          });
        },

        isCitizenshipRequired: (postUUID, user) => {
          const post = get().posts.find((post) => post.uuid === postUUID);

          if (!post || user.membership.status === "citizen") {
            return false;
          }

          return post.text_content_length > get().NON_CITIZEN_POST_TEXT_LENGTH;
        },
      },
    }),
    {
      name: "PostEditorStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);

export type ModalType =
  | null
  | "new-post"
  | "reply-of-thread-post"
  | "reply"
  | "reply-of-reply"
  | "edit";

interface OpenModalOptionsBase {
  shouldAddNewPost: boolean;
  onCloseModal?: () => void;
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
}

type OpenModalOptions =
  | OpenModalOptionsCreate
  | OpenModalOptionsReplyOfThreadPost
  | OpenModalOptionsReply
  | OpenModalOptionsReplyOfReply
  | OpenModalOptionsEdit;
