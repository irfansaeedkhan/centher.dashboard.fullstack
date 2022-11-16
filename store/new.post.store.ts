import create from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";

import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

export interface NewPostStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  isPostCreateLoading: boolean;
  setIsPostCreateLoading: (isLoading: boolean) => void;

  selectedFiles: FileWithID[];
  setSelectedFiles: (files: FileWithID[]) => void;
  addSelectedFiles: (files: FileWithID[]) => void;
  removeSelectedFile: (fileId: string) => void;

  postTextMaxLength: 200;
  postText: string;
  setPostText: (text: string) => void;

  createPost: () => void;
}

export const useNewPostStore = create<NewPostStore>()(
  devtools(
    (set, get) => ({
      isModalOpen: false,
      openModal: () => {
        // Hide scroll bar
        document.body.style.overflow = "hidden";
        set({ isModalOpen: true });
      },
      closeModal: () => {
        // Show scroll bar
        document.body.style.overflow = "auto";
        set({
          isModalOpen: false,
          selectedFiles: [],
          isPostCreateLoading: false,
          postText: "",
        });
      },

      isPostCreateLoading: false,
      setIsPostCreateLoading: (isLoading) =>
        set({ isPostCreateLoading: isLoading }),

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

      postTextMaxLength: 200,
      postText: "",
      setPostText: (text: string) => set({ postText: text }),

      createPost: async (): Promise<any> => {
        try {
          const { postText, selectedFiles } = get();

          if (postText.trim() === "" && selectedFiles.length < 1) {
            toast.error("Please add some text or a photo/video");
            return;
          }

          if (selectedFiles.length > 5) {
            toast.error("You can only upload a maximum of 5 photos/videos");
            return;
          }

          set({ isPostCreateLoading: true });

          // let filesChunksDetails: Array<FileChunksChunksCalculations> =
          //   await post_file_details(userSelectedFiles);

          // setUploadingFileStatus(0);
          // setFile(filesChunksDetails[0]?.file_name);

          let { data } = await axiosNodeApi.post(
            `/api/socials/posts/signedurl`,
            {
              post_files_detail: [],
              post_text: postText,
              // reply_post_id: reply_post_id,
            }
          );

          // console.log("Post created data : ", data);
          // if (reply && data.message_description == "Post created successfully") {
          //   setTotalReplyCount((prev) => Number(prev) + 1);
          // }

          // currentPostID = data.post_id;

          // // If no file media that means only text was avaible in post
          // if (filesChunksDetails.length == 0) {
          //   //setUploadingFileStatus(100);
          // await getNewPostAndUpdateState();
          get().closeModal();
          //   return;
          // }

          // // Starting uploading of task
          // await UploadFiles(filesChunksDetails, 0, data.post_url).catch((error) => {
          //   console.log("Error ", error);
          // });
        } catch (error: any) {
          customLog("Error in create post: ", ["development"]);
          customLog(error, ["development"]);
        }
      },
    }),
    { name: "NewPostStore" }
  )
);

interface FileWithID {
  original: File;
  id: string;
}
