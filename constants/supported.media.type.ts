// Video format allowed to upload on server
export const SUPPORTED_VIDEO_TYPES = ".webm,.mp4,.m4v,.mov,.ogv,.mkv";

export const SUPPORTED_VIDEO_MIME_TYPES = [
  "video/webm", // Supported
  "video/mp4", // Supported
  "video/x-m4v", // Supported (.m4v for iOS)
  "video/quicktime", // Supported (.mov)
  "video/ogg", // Supported (.ogv)
  "video/x-matroska", // Supported (.mkv)
];

// Image format allowed to upload on server
export const SUPPORTED_IMAGE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/jfif",
  "image/pjpeg",
  "image/pjp",
];

// Maximum 5 file images in post
export const MAX_IMAGE_USER_UPLOAD = 5;

// Maximum 5 file video in post
export const MAX_VIDEO_USER_UPLOAD = 5;

// Allowing max 15 MB of image to upload on server
export const MAX_IMAGE_SIZE = 15000000;

// Allowing max 25 MB of video size to upload on server
export const MAX_VIDEO_SIZE = 25000000;
