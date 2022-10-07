import { useState, useEffect } from "react";
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
  //Selected file by User
  const [userSelectedFileListArray, setuserSelectedFileListArray] =
    useState<FileList>([]);

  //
  //TO DO : Remove
  const [selectedFileDetail, setselectedFileDetail] = useState(
    Array<FileChunksChunksCalculations>
  );

  const [previewFilesUI, setpreviewFilesUI] = useState(Array<JSX.Element>);

  let currentPostID: string = "";

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
      console.log("Invalid file type");
      // TO DO : Add alert of something to display error message
      return;
    }

    setuserSelectedFileListArray(event.target.files);
    console.log("Files : ", event.target.files);
    let previewUrlList: Array<PreviewSelectedFile> = [];
    previewUrlList.push({
      fileListIndex: 0,
      fileIndex: 0,
      fileType: event.target.files[0].type,
      fileBlobURL: URL.createObjectURL(event.target.files[0]),
    });
    createSelectedFileUI(previewUrlList);
    setdisplayImage(true);
  };

  const displayProfileImage = () => {};

  const uploadImage = async () => {
    let fileChunksDetails: FileChunksChunksCalculations;

    console.log("Image file ", userSelectedFileListArray);
    if (userSelectedFileListArray.length < 1) {
      console.log("Upload image ");
    }

    let { chunks_range, no_of_chunks } = await calculateFileChunksSizes(
      userSelectedFileListArray[0].size
    );

    console.log("Calculating file name for : ", chunks_range, no_of_chunks);
    fileChunksDetails = {
      file_name: userSelectedFileListArray[0].name,
      file_size: userSelectedFileListArray[0].size,
      file_type: userSelectedFileListArray[0].type,
      no_of_chunk: no_of_chunks,
      index_of_file: 0,
      chunks_range: chunks_range,
    };

    let { data } = await axiosNodeApi.post(`/api/socials/posts/insert`, {
      post_files_detail: fileChunksDetails,
      media_type,
    });
  };
  return {
    displayImage,
    setdisplayImage,
    errorDescription,
    previewFilesUI,
    uploadImage,
    handleSelectedFile,
  };
}
