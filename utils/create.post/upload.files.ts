import axios from "axios";

import { useSinglePostStore } from "@/store/single.post.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useFeedStore } from "@/store/feed.store";
import { useNewPostStore } from "@/store/new.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";

import { axiosNodeApi } from "../axios";
import { customLog } from "../custom.log";
import { FileChunksData } from "./create.files.chunks";

export const uploadFiles = async (
  filesChunksData: FileChunksData[],
  uploadingFileIndex: number,
  signedurls: string[][],
  currentPostId: string
) => {
  if (uploadingFileIndex >= filesChunksData.length) {
    await getNewPostAndUpdateState(currentPostId);
    // Close Post Modal on successful upload
    useNewPostStore.getState().closeModal();
    return;
  }
  await uploadChunks(
    filesChunksData,
    uploadingFileIndex,
    0,
    signedurls,
    currentPostId
  );
};

const uploadChunks = async (
  filesChunksData: FileChunksData[],
  uploadingFileIndex: number,
  chunkIndex: number,
  signedUrl: string[][],
  currentPostId: string
) => {
  try {
    if (chunkIndex >= filesChunksData[uploadingFileIndex].chunks_range.length) {
      customLog("File upload complete", ["development"]);
      return;
    }

    // Creating reader object for readingchunk_index file
    const fileReader = new FileReader();

    const fileChunkData = filesChunksData[uploadingFileIndex];

    const starting = fileChunkData.chunks_range[chunkIndex].Starting;

    const ending = fileChunkData.chunks_range[chunkIndex].Ending;

    const fileIndex = fileChunkData.index_of_file;

    const blob = useNewPostStore
      .getState()
      .selectedFiles[fileIndex].original.slice(starting, ending);

    fileReader.onloadend = async function (event: any) {
      try {
        if (event?.target?.readyState !== FileReader.DONE) {
          customLog("File reading complete", ["development"]);
          return;
        }

        // Storing data
        const dataRead = event?.target?.result;

        const axiosInstance = await axios.create();
        delete axiosInstance.defaults.headers.put["Content-Type"];

        const resultupload = await axiosInstance.put(
          signedUrl[uploadingFileIndex][chunkIndex],
          dataRead
        );

        axiosNodeApi
          .post("/api/socials/posts-media/upload/signedurl", {
            etag: resultupload.headers.etag,
            post_id: currentPostId,
            file_index: uploadingFileIndex,
            chunk_no: chunkIndex,
            bytes_uploaded: dataRead.length,
          })
          .then((updateetag) => {
            customLog("Updated etag ", ["development"]);
            customLog(updateetag?.data, ["development"]);

            if (fileChunkData.chunks_range.length - 1 === chunkIndex) {
              // All chunks are uploaded now need to upload new file
              completeMultipartUpload(
                filesChunksData,
                uploadingFileIndex,
                signedUrl,
                currentPostId
              );
            } else {
              // Upload next chunk
              uploadChunks(
                filesChunksData,
                uploadingFileIndex,
                chunkIndex + 1,
                signedUrl,
                currentPostId
              );
            }
          })
          .catch((error) => {
            customLog("Failed to create post", ["development"]);
            customLog(error, ["development"]);
          });
      } catch (error: any) {
        customLog("Failed to upload data to: ", ["development"]);
        customLog(error, ["development"]);
      }
    };

    fileReader.readAsArrayBuffer(blob);
  } catch (error: any) {
    customLog("Failed to created post", ["development"]);
    customLog(error, ["development"]);
  }
};

const completeMultipartUpload = async (
  filesChunksData: FileChunksData[],
  fileIndex: number,
  signedurls: Array<Array<string>>,
  currentPostId: string
) => {
  try {
    await axiosNodeApi.post("/api/socials/posts-media/complete/signedurl", {
      post_id: currentPostId,
      file_index: fileIndex,
    });

    await uploadFiles(
      filesChunksData,
      fileIndex + 1,
      signedurls,
      currentPostId
    );
  } catch (error: any) {
    customLog("Failed to complete upload:", ["development"]);
    customLog(error, ["development"]);
  }
};

export const getNewPostAndUpdateState = async (currentPostId: string) => {
  // Get the new post and add it to the top of the post list
  const { data: postData } = await axiosNodeApi.get(
    `/api/socials/posts/${currentPostId}`
  );

  const newPostStoreState = useNewPostStore.getState();
  const feedStoreState = useFeedStore.getState();
  const myPostStoreState = useMyPostStore.getState();

  if (newPostStoreState.modalType === "new-post") {
    feedStoreState.addNewPost(postData.post);
    myPostStoreState.addNewPost(postData.post);
    useProfileCardStore.getState().incrementPostsCount();
  } else if (
    newPostStoreState.modalType === "reply" &&
    newPostStoreState.parentPostId
  ) {
    feedStoreState.incrementPostRepliesCount(newPostStoreState.parentPostId);

    const singlePostStoreState = useSinglePostStore.getState();

    singlePostStoreState.addNewReply(postData.post);

    const prevRepliesCount = singlePostStoreState.post?.replies_count;
    singlePostStoreState.updatePost({
      replies_count: prevRepliesCount ? prevRepliesCount + 1 : 1,
    });
  } else if (newPostStoreState.modalType === "edit") {
    // Update all stores as we don't know which store the post is in
    feedStoreState.replaceEditedPost(postData.post);
    myPostStoreState.replaceEditedPost(postData.post);
    useSinglePostStore.getState().replaceEditedPost(postData.post);
  }
};
