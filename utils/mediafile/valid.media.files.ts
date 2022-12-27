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

export type fileAlreadySelected = {
  file_name: string;
  file_size: number;
  file_type: string;
  lastModified: number;
  index_of_file_list: number;
  index_of_file: number;
};
// Function will check if file already exits in selected file list or not
// Function will check following things
// file name
// file size
// file lastmodified data
export const checkFileAlreadyAddedInSelectedFile = (
  fileListArray: Array<FileList>,
  selected_files: FileList
): fileAlreadySelected[] => {
  let fileAlreadyExits: fileAlreadySelected[] = [];
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
          fileAlreadyExits.push({
            file_name: selected_files[selected_file_index].name,
            file_size: selected_files[selected_file_index].size,
            file_type: selected_files[selected_file_index].type,
            lastModified: selected_files[selected_file_index].lastModified,
            index_of_file_list: Number(files_list_index),
            index_of_file: file_index,
          });
        }
      }
    }
  }

  return fileAlreadyExits;
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
    //
    for (let file = 0; file < fileListArray[files_list_index].length; file++) {
      // Cheking if file is not inclued in list of deleted files
      if (
        removedFiles.indexOf(String(files_list_index) + "," + String(file)) ==
        -1
      ) {
        //C
        let { chunks_range, no_of_chunks } = await calculateFileChunksSizes(
          fileListArray[files_list_index][file].size
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

export type DuplicateFileDetails = {
  deletedFiles: string[];
  duplicateFiles: string[];
};

export const checkIfSelectedFileExitsInDeletedFile = (
  duplicateFileDetails: fileAlreadySelected[],
  deletedFileList: string[]
): DuplicateFileDetails => {
  //
  let duplicateFiles: string[] = [];
  let deletedFiles: string[] = [];

  for (
    let file_index = 0;
    file_index < duplicateFileDetails.length;
    file_index++
  ) {
    let fileExistsInDeleted = deletedFileList.indexOf(
      duplicateFileDetails[file_index].index_of_file_list +
        "," +
        duplicateFileDetails[file_index].index_of_file
    );
    if (fileExistsInDeleted > -1) {
      //Remove from deleted list
      deletedFileList.splice(fileExistsInDeleted, 1);
    } else {
      duplicateFiles.push(
        duplicateFileDetails[file_index].index_of_file_list +
          "," +
          duplicateFileDetails[file_index].index_of_file
      );
    }
  }
  let response: DuplicateFileDetails = {
    duplicateFiles: duplicateFiles,
    deletedFiles: deletedFiles,
  };
  return response;
};
