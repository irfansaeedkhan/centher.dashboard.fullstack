import { create } from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";

import { PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import {
  createFilesChunks,
  getNewPostAndUpdateState,
  uploadFiles,
} from "@/utils/create.post";
import { v1 as uuid } from "uuid";
import { initial } from "lodash";

interface SelectedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}
export interface NewPostStore {
  modalType: ModalType;
  postId: string | null;
  parentPostId: string | null;

  isModalOpen: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;

  isPostModalLoading: boolean;
  setisPostModalLoading: (isLoading: boolean) => void;

  selectedFiles: FileWithID[];
  setSelectedFiles: (files: FileWithID[]) => void;
  addSelectedFiles: (files: FileWithID[]) => void;
  removeSelectedFile: (fileId: string) => void;

  editPostFiles?: EditFileWithID[];
  removeEditPostFile: (fileId: string) => void;

  postTextMaxLength: 260;
  postText: string;
  setPostText: (text: string) => void;

  createPost: () => Promise<void>;
  posts: {
    media?: FileWithID[];
    post_text: string;
    uuid: string;
    media_count: number;
  }[];
  createThread: () => Promise<void>;
  editPost: () => Promise<void>;

  onCloseModal: () => void;
}

export const useNewPostStore = create<NewPostStore>()(
  devtools(
    (set, get) => ({
      modalType: null,
      postId: null,
      parentPostId: null,
      posts: [],
      isModalOpen: false,
      openModal: (options) => {
        // Hide scroll bar
        document.body.style.overflow = "hidden";
        set({ isModalOpen: true, ...options });
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
          postText: "",
          editPostFiles: undefined,
          posts: [],
        });
        if (get().onCloseModal) {
          get().onCloseModal();
        }
        set({ onCloseModal: () => {} });
      },

      onCloseModal: () => {},

      isPostModalLoading: false,
      setisPostModalLoading: (isLoading) =>
        set({ isPostModalLoading: isLoading }),

      selectedFiles: [],
      setSelectedFiles: (files: FileWithID[]) => set({ selectedFiles: files }),
      addSelectedFiles: (files: FileWithID[]) =>
        set((state) => ({ selectedFiles: [...state.selectedFiles, ...files] })),

      removeSelectedFile: (fileId: string) =>
        set((state) => ({
          selectedFiles: state.selectedFiles.filter(
            (file) => file.id !== fileId
          ),
        })),

      editPostFiles: undefined,
      removeEditPostFile: (fileId: string) => {
        set((state) => ({
          editPostFiles: state.editPostFiles?.map((file) =>
            file.id === fileId ? { ...file, isDeleted: true } : file
          ),
        }));
      },

      postTextMaxLength: 260,
      postText: "",
      setPostText: (text: string) => set({ postText: text }),

      createThread: async () => {
        try {
          const { postText, selectedFiles, parentPostId } = get();
          if (selectedFiles.length < 1) {
            console.log("No files");
            get().posts.push({
              uuid: uuid(),
              post_text: postText,
              media_count: 0,
            });
          }
          set({ postText: "", selectedFiles: [], parentPostId: null });
        } catch (error: any) {
          console.log(error);
        }
      },

      createPost: async () => {
        try {
          let postArray = get().posts;

          const { postText, selectedFiles, parentPostId } = get();
          if (selectedFiles.length < 1) {
            if (postText.trim() === "" && !postArray) {
              toast.error("Please add some text or a photo/video");
              return;
            }
            if (!postArray || postText.trim() !== "") {
              get().posts.push({
                uuid: uuid(),
                post_text: postText,
                media_count: 0,
              });
              set({ postText: "", selectedFiles: [], parentPostId: null });
            }
            postArray = get().posts;
          }

          set({ isPostModalLoading: true });
          await axiosNodeApi.post(`/api/socials/posts/v2`, {
            posts: postArray,
          });
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
          const { postText, editPostFiles, postId } = get();

          if (
            postText.trim() === "" &&
            (!editPostFiles ||
              editPostFiles.filter((f) => f.isDeleted).length ===
                editPostFiles.length)
          ) {
            toast.error("You can not make the post empty");
            return;
          }

          set({ isPostModalLoading: true });

          await axiosNodeApi.patch(`/api/socials/posts/${postId}/edit`, {
            text: postText,
            deleted_media: editPostFiles
              ?.filter((file) => file.isDeleted)
              .map((file) => file.original.url),
          });

          // If no file media that means only text was available in post
          await getNewPostAndUpdateState(postId!);
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

export interface FileWithID {
  original: File;
  id: string;
}

export type EditFileWithID = {
  original: PostMedia;
  id: string;
  isDeleted: boolean;
};

type ModalType = null | "new-post" | "reply" | "reply-of-reply" | "edit";

interface OpenModalOptionsBase {
  onCloseModal?: () => void;
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
  editPostFiles?: EditFileWithID[];
  postText?: string;
}

type OpenModalOptions =
  | OpenModalOptionsCreate
  | OpenModalOptionsReply
  | OpenModalOptionsReplyOfReply
  | OpenModalOptionsEdit;
