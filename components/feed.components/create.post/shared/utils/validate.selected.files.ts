import { nanoid } from "nanoid";

import { useNewPostStore } from "@/store/new.post.store";

import {
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_MIME_TYPES,
} from "@/constants/supported.media.type";

// Function will be called when user click on photo or video icon on create post
export const validateSelectedFiles = (
  event: React.ChangeEvent<HTMLInputElement>,
  fileType: FileType
) => {
  try {
    // Return if files is null for some reason
    if (!event.target.files) {
      event.target.value = "";
      return;
    }

    // Return if user didn't select any file
    if (event.target.files.length < 1) {
      event.target.value = "";
      return;
    }

    // Check if selected files are valid - can throw error
    for (let i = 0; i < event.target.files.length; i++) {
      validateFile(event.target.files[i], fileType);
    }

    const { addSelectedFiles, getLastPost } = useNewPostStore.getState();

    const lastPost = getLastPost();

    // Convert to array
    const files = Array.from(event.target.files ?? []);

    // Only add files in store if there are less than 5 files
    if (
      lastPost &&
      lastPost.media.length < 5 &&
      files.length + lastPost.media.length <= 5
    ) {
      addSelectedFiles(files);
    } else {
      const error: SelectFileError = {
        code: "app_max_file_count",
        message: "Maximum 5 files are allowed in post",
      };
      throw error;
    }

    // Empty input value so that user can select same file again
    event.target.value = "";
  } catch (error) {
    event.target.value = "";
    throw error;
  }
};

/** Function will validate following details of a file
 * file size
 * file type
 */
export const validateFile = (file: File, fileType: FileType) => {
  const error: SelectFileError = {
    code: 0,
    message: "",
  };

  const supportedFileTypes =
    fileType === "image"
      ? SUPPORTED_IMAGE_TYPES
      : fileType === "video"
      ? SUPPORTED_VIDEO_MIME_TYPES
      : [];

  const maxFileSize =
    fileType === "image"
      ? MAX_IMAGE_SIZE
      : fileType === "video"
      ? MAX_VIDEO_SIZE
      : 0;

  // Check if file is not supported
  if (!supportedFileTypes.includes(file.type)) {
    error.code = "app_file_format_not_supported";
    if (fileType === "image") {
      error.message = "The image format is not supported";
    } else if (fileType === "video") {
      error.message = "The video format is not supported";
    } else {
      error.message = "The file format is not supported";
    }

    throw error;
  }

  // Check if file is greater than allowed size
  if (file.size > maxFileSize) {
    error.code = "app_file_size_exceeded";

    if (fileType === "image") {
      error.message = `Image should be less than ${
        MAX_IMAGE_SIZE / (1000 * 1000)
      } MB`;
    } else if (fileType === "video") {
      error.message = `Video should be less than ${
        MAX_VIDEO_SIZE / (1000 * 1000)
      } MB`;
    }

    throw error;
  }
};

export type FileType = "image" | "video";

export interface SelectFileError {
  code:
    | 0
    | "app_file_format_not_supported"
    | "app_file_size_exceeded"
    | "app_max_file_count"; // 0 for no error
  message: string;
}
