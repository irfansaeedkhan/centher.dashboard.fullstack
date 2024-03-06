export const SUPPORTED_VIDEO_MIME_TYPES = [
  "video/webm", // Supported
  "video/mp4", // Supported
  "video/x-m4v", // Supported (.m4v for iOS)
  "video/quicktime", // Supported (.mov)
  "video/ogg", // Supported (.ogv)
  "video/x-matroska", // Supported (.mkv)
];

// Image format allowed to upload on server
export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Maximum 5 file images in post
export const MAX_IMAGE_USER_UPLOAD = 5;

// Maximum 5 file video in post
export const MAX_VIDEO_USER_UPLOAD = 5;

// Allowing max 15 MB of image to upload on server
export const MAX_IMAGE_SIZE = 15000000;

// Allowing max 25 MB of video size to upload on server
export const MAX_VIDEO_SIZE = 25000000;
