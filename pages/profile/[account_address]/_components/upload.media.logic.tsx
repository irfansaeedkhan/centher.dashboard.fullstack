import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosNodeApi } from "@/utils/axios";
import { checkValidImageFile } from "@/utils/mediafile/valid.media.files";
import {
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from "@/constants/supported.media.type";
import Image from "next/future/image";
import {
  calculateFileChunksSizes,
  FileChunksDetails,
  FileChunks,
} from "@/utils/mediafile/filechunks";

type PreviewSelectedFile = {
  fileListIndex: number;
  fileIndex: number;
  fileType: string;
  fileBlobURL: string;
};

export type FileChunksChunksCalculations = {
  file_name: string;
  file_size: number;
  file_type: string;
  no_of_chunk: number;
  index_of_file: number;
  chunks_range: FileChunks[];
};

export function useUserMediaUpload(media_type: string) {
  const [errorDescription, seterrorDescription] = useState<string>();
  //Showing Modal
  const [displayImage, setdisplayImage] = useState<boolean>(false);
  const [uploadImageButton, setUploadImage] = useState<boolean>(false);
  //Selected file by User
  const [userSelectedFileListArray, setuserSelectedFileListArray] =
    useState<FileList>();

  const [previewFilesUI, setpreviewFilesUI] = useState(Array<JSX.Element>);
  const [imageUrl, setImageUrl] = useState<string>();

  let currentCoverID: string = "";

  let previewFileList: Array<PreviewSelectedFile> = [];

  const createSelectedFileUI = (previewUrlList: Array<PreviewSelectedFile>) => {
    let displaySelectedFile: JSX.Element[] = previewFilesUI;
    displaySelectedFile.push(
      <Image
        src={previewUrlList[0].fileBlobURL}
        width={452}
        height={312}
        alt="post media"
      />
    );
    setpreviewFilesUI(displaySelectedFile);
    setUploadImage(true);
  };
  //Function will be passed to the
  const handleSelectedFile = (event: any) => {
    // Checking if file is selected or not
    if (!event?.target?.files) {
      return;
    }

    // No file selected returning
    if (event.target.files.length < 1) {
      return;
    }

    let validFileType: boolean = false;

    // Check if selected files have valid file extension or not
    for (
      let file_index = 0;
      file_index < event.target.files.length;
      file_index++
    ) {
      // Checking if valid image type
      validFileType = checkValidImageFile(event.target.files[file_index]);

      // Show error message
      if (!validFileType) {
        break;
      }
    }

    //
    if (!validFileType) {
      // TO DO : Add alert of something to display error message
      return;
    }

    setuserSelectedFileListArray(event.target.files);
    let previewUrlList: Array<PreviewSelectedFile> = [];
    previewUrlList.push({
      fileListIndex: 0,
      fileIndex: 0,
      fileType: event.target.files[0].type,
      fileBlobURL: URL.createObjectURL(event.target.files[0]),
    });
    createSelectedFileUI(previewUrlList);
  };

  const displayProfileImage = () => {};

  const uploadImage = async () => {
    let fileChunksDetails: FileChunksChunksCalculations;

    if (!userSelectedFileListArray) {
      return;
    }

    if (userSelectedFileListArray && userSelectedFileListArray.length < 1) {
      return;
    }

    let { chunks_range, no_of_chunks } = calculateFileChunksSizes(
      userSelectedFileListArray?.[0].size
    );

    fileChunksDetails = {
      file_name: userSelectedFileListArray?.[0].name,
      file_size: userSelectedFileListArray?.[0].size,
      file_type: userSelectedFileListArray?.[0].type,
      no_of_chunk: no_of_chunks,
      index_of_file: 0,
      chunks_range: chunks_range,
    };

    let { data } = await axiosNodeApi.post(`/api/socials/profile/insert`, {
      media_file_details: fileChunksDetails,
      media_purpose: media_type,
    });

    currentCoverID = data.cover_id;

    await UploadFile(fileChunksDetails, 0).catch((error: any) => {
      console.log("Error ", error);
    });
  };

  const UploadFile = async (
    filesChunksDetails: FileChunksChunksCalculations,
    uploading_file_index: number
  ) => {
    try {
      await UploadChunks(filesChunksDetails, uploading_file_index, 0);
    } catch (error) {
      console.log("Failed to delete post");
    }
  };

  const UploadChunks = async (
    filesChunksDetails: FileChunksChunksCalculations,
    uploading_file_index: number,
    chunk_index: number
  ) => {
    try {
      if (chunk_index >= filesChunksDetails.chunks_range.length) {
        return;
      }

      if (!userSelectedFileListArray) {
        return;
      }

      //Creating reader object for reading file
      let fileReader = new FileReader();

      let file_details = filesChunksDetails;

      let starting = file_details.chunks_range[chunk_index].Starting;

      let ending = file_details.chunks_range[chunk_index].Ending;

      let fileIndex = file_details.index_of_file;

      let blob = userSelectedFileListArray[fileIndex].slice(starting, ending);

      //Onload
      fileReader.onloadend = async function (event: any) {
        try {
          if (event?.target?.readyState !== FileReader.DONE) {
            return;
          }

          //Storing data
          let dataRead = event?.target?.result;

          let header = {
            headers: {
              "Content-Type": "application/octet-stream",
              "user-media-details": JSON.stringify({
                chunk_no: chunk_index,
                media_id: currentCoverID,
                file_index: uploading_file_index,
              }),
              "Content-Range":
                "bytes " +
                starting +
                "-" +
                ending +
                "/" +
                file_details.file_size,
            },
          };

          await axiosNodeApi
            .post("/api/socials/profile/upload", dataRead, header)
            .then((image_upload_result) => {
              //Checking all chunks are uploaded
              if (file_details.chunks_range.length - 1 == chunk_index) {
                //All chunks are uploaded now need to upload new file
                CompleteMultipartUpload();
              } else {
                //Upload Next Chunk
                UploadChunks(
                  filesChunksDetails,
                  uploading_file_index,
                  chunk_index + 1
                );
              }
            });
        } catch (error) {
          console.log("Failed to upload data to : ", error);
        }
      };

      //
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const CompleteMultipartUpload = async () => {
    try {
      const { data } = await axiosNodeApi.post(
        "/api/socials/profile/complete",
        {
          user_media_id: currentCoverID,
        }
      );
      setdisplayImage(true);
      setUploadImage(false);
      setImageUrl(data.url);
    } catch (error) {
      console.log("Failed to complete upload : ", error);
    }
  };

  return {
    displayImage,
    setdisplayImage,
    errorDescription,
    previewFilesUI,
    uploadImageButton,
    uploadImage,
    handleSelectedFile,
    imageUrl,
  };
}
