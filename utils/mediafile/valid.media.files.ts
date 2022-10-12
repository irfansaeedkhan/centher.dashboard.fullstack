import {
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "@/constants/supported.media.type";
import {
  calculateFileChunksSizes,
  FileChunksDetails,
  FileChunks,
} from "@/utils/mediafile/filechunks";

// Function will check following detail in image file
// image size
// image type
export const checkValidImageFile = (file_details: File): string => {
  //Checking if image file is supported or not
  if (!SUPPORTED_IMAGE_TYPES.includes(file_details.type)) {
    //
    return "The file format is not supported";
  }

  //Checking if image file is less than allowed size
  if (file_details.size > MAX_IMAGE_SIZE) {
    //
    return (
      "Image should be less than " + MAX_IMAGE_SIZE / (1000 * 1000) + " MB"
    );
  }

  return "";
};

// Function will check following details in video file
// video size
// video type
export const checkValidVideoFile = (file_details: File): string => {
  //Checking if video file is supported or not
  if (!SUPPORTED_VIDEO_TYPES.includes(file_details.type)) {
    //

    return "The file format is not supported";
  }

  //Checking if video file is less than allowed size
  if (file_details.size > MAX_VIDEO_SIZE) {
    //
    return (
      "Video should be less than " + MAX_VIDEO_SIZE / (1000 * 1000) + " MB"
    );
  }

  return "";
};

// Function will check if file already exits in selected file list or not
// Function will check following things
// file name
// file size
// file lastmodified data
export const checkFileAlreadyAddedInSelectedFile = (
  fileListArray: Array<FileList>,
  selected_files: FileList
): boolean => {
  //
  for (
    let selected_file_index = 0;
    selected_file_index < selected_files.length;
    selected_file_index++
  ) {
    for (let files_list_index in fileListArray) {
      //
      for (
        let file_index = 0;
        file_index < fileListArray[files_list_index].length;
        file_index++
      ) {
        if (
          fileListArray[files_list_index][file_index].name ==
            selected_files[selected_file_index].name &&
          fileListArray[files_list_index][file_index].size ==
            selected_files[selected_file_index].size &&
          fileListArray[files_list_index][file_index].lastModified ==
            selected_files[selected_file_index].lastModified
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

export type FileChunksChunksCalculations = {
  file_name: string;
  file_size: number;
  file_type: string;
  no_of_chunk: number;
  index_of_file_list: number;
  index_of_file: number;
  chunks_range: FileChunks[];
};

//Function will calculate chunks of the file
export const post_file_details = async (
  fileListArray: Array<FileList>,
  removedFiles: string[] = []
): Promise<Array<FileChunksChunksCalculations>> => {
  let fileChunksDetails: Array<FileChunksChunksCalculations> = [];
  //
  for (let files_list_index in fileListArray) {
    console.log(
      "Checking list of filelist array ",
      fileListArray[files_list_index]
    );
    //
    for (let file = 0; file < fileListArray[files_list_index].length; file++) {
      console.log(
        "Checking Each file : ",
        fileListArray[files_list_index][file]
      );
      console.log(
        "Checking if file is inclued in delete file list : ",
        String(files_list_index) + "," + String(file)
      );
      console.log(
        "If condition value : ",
        removedFiles.indexOf(String(files_list_index) + "," + String(file)) ==
          -1
      );
      // Cheking if file is not inclued in list of deleted files
      if (
        removedFiles.indexOf(String(files_list_index) + "," + String(file)) ==
        -1
      ) {
        //C
        let { chunks_range, no_of_chunks } = await calculateFileChunksSizes(
          fileListArray[files_list_index][file].size
        );
        console.log(
          "Calculating file name for : ",
          fileListArray[files_list_index][file].name
        );
        await fileChunksDetails.push({
          file_name: fileListArray[files_list_index][file].name,
          file_size: fileListArray[files_list_index][file].size,
          file_type: fileListArray[files_list_index][file].type,
          no_of_chunk: no_of_chunks,
          index_of_file_list: Number(files_list_index),
          index_of_file: file,
          chunks_range: chunks_range,
        });
      }
    }
  }

  return fileChunksDetails;
};
