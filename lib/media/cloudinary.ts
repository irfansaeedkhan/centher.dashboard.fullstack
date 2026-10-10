/**
 * Phase 11: Cloudinary media uploads (free tier).
 *
 * Replaces the dead S3 presigned-URL flow (honest 501s) with direct
 * browser-to-Cloudinary unsigned uploads. No backend needed — the browser
 * POSTs straight to Cloudinary and gets back a `secure_url`.
 *
 * Setup (see docs/CLOUDINARY_SETUP.md):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud name>
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<unsigned preset name>
 *
 * When the env vars are missing, callers get CloudinaryNotConfiguredError
 * and should fall back to the honest "not configured" UX — never fake it.
 */

export class CloudinaryNotConfiguredError extends Error {
  constructor() {
    super(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
    this.name = "CloudinaryNotConfiguredError";
  }
}

export class CloudinaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB (Cloudinary free max)

/** True when the browser can upload directly to Cloudinary. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );
}

function getCloudName(): string {
  const name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!name) throw new CloudinaryNotConfiguredError();
  return name;
}

function getUploadPreset(): string {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!preset) throw new CloudinaryNotConfiguredError();
  return preset;
}

/** Validate an image file before upload. Throws CloudinaryUploadError. */
export function validateImageFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new CloudinaryUploadError(
      `Invalid file type "${
        file.type || "unknown"
      }". Only JPG, PNG, GIF and WebP are allowed.`,
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new CloudinaryUploadError(
      `Image is too large (${(file.size / 1024 / 1024).toFixed(
        1,
      )}MB). Maximum is 10MB.`,
    );
  }
}

/**
 * Upload an image to Cloudinary via an unsigned preset.
 * Returns the `secure_url`. Throws CloudinaryNotConfiguredError when the
 * env vars are missing, CloudinaryUploadError on validation/upload failure.
 */
export async function uploadImage(
  file: File,
  folder: string = "centher",
): Promise<string> {
  validateImageFile(file);
  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  let res: Response;
  try {
    res = await fetch(endpoint, { method: "POST", body: formData });
  } catch (err: any) {
    throw new CloudinaryUploadError(
      `Upload failed: ${err?.message || "network error"}. Please try again.`,
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.error?.message || `HTTP ${res.status}`;
    throw new CloudinaryUploadError(`Upload failed: ${detail}`);
  }

  const data = await res.json().catch(() => null);
  const secureUrl = data?.secure_url as string | undefined;
  if (!secureUrl) {
    throw new CloudinaryUploadError(
      "Upload failed: Cloudinary did not return an image URL.",
    );
  }
  return secureUrl;
}

/* ------------------------------------------------------------------ */
/* Phase 15: chat media uploads (images, videos, audio, documents).    */
/* MIME allowlists follow the company-os chat.service.ts pattern;      */
/* SVG is rejected outright (stored-XSS when served inline).           */
/* ------------------------------------------------------------------ */

export const CHAT_IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
]);

export const CHAT_VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
  "video/3gpp",
]);

export const CHAT_AUDIO_MIMES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/aac",
  "audio/x-m4a",
  "audio/flac",
]);

export const CHAT_FILE_MIMES = new Set([
  "application/pdf",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
]);

export type ChatMediaKind = "image" | "video" | "audio" | "file";

export const MAX_CHAT_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_CHAT_AUDIO_BYTES = 25 * 1024 * 1024; // 25MB
export const MAX_CHAT_FILE_BYTES = 25 * 1024 * 1024; // 25MB

/** Classify a file into a chat media kind. Throws on disallowed types. */
export function classifyChatFile(file: File): ChatMediaKind {
  const type = file.type || "";
  if (CHAT_IMAGE_MIMES.has(type)) return "image";
  if (CHAT_VIDEO_MIMES.has(type)) return "video";
  if (CHAT_AUDIO_MIMES.has(type)) return "audio";
  if (CHAT_FILE_MIMES.has(type)) return "file";
  throw new CloudinaryUploadError(
    `File type "${type || "unknown"}" is not supported in chat.`,
  );
}

/** Validate a chat file (type + size). Throws CloudinaryUploadError. */
export function validateChatFile(file: File): ChatMediaKind {
  const kind = classifyChatFile(file);
  const cap =
    kind === "video"
      ? MAX_CHAT_VIDEO_BYTES
      : kind === "audio"
        ? MAX_CHAT_AUDIO_BYTES
        : kind === "file"
          ? MAX_CHAT_FILE_BYTES
          : MAX_IMAGE_BYTES;
  if (file.size > cap) {
    throw new CloudinaryUploadError(
      `File is too large (${(file.size / 1024 / 1024).toFixed(
        1,
      )}MB). Maximum is ${(cap / 1024 / 1024).toFixed(0)}MB.`,
    );
  }
  return kind;
}

export interface ChatUploadResult {
  url: string;
  kind: ChatMediaKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  durationSec?: number;
  width?: number;
  height?: number;
}

/**
 * Upload a chat media file to Cloudinary via the unsigned preset.
 * Uses resource_type "auto" so video/audio are accepted, not just images.
 */
export async function uploadChatMedia(
  file: File,
  folder: string = "centher/chat",
): Promise<ChatUploadResult> {
  const kind = validateChatFile(file);
  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  let res: Response;
  try {
    res = await fetch(endpoint, { method: "POST", body: formData });
  } catch (err: any) {
    throw new CloudinaryUploadError(
      `Upload failed: ${err?.message || "network error"}. Please try again.`,
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.error?.message || `HTTP ${res.status}`;
    throw new CloudinaryUploadError(`Upload failed: ${detail}`);
  }

  const data = await res.json().catch(() => null);
  const secureUrl = data?.secure_url as string | undefined;
  if (!secureUrl) {
    throw new CloudinaryUploadError(
      "Upload failed: Cloudinary did not return a file URL.",
    );
  }

  return {
    url: secureUrl,
    kind,
    mimeType: file.type,
    fileName: file.name,
    fileSize: file.size,
    durationSec: data?.duration ? Math.round(Number(data.duration)) : undefined,
    width: data?.width,
    height: data?.height,
  };
}
