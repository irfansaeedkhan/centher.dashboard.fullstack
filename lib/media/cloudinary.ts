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
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
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
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
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
      }". Only JPG, PNG, GIF and WebP are allowed.`
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new CloudinaryUploadError(
      `Image is too large (${(file.size / 1024 / 1024).toFixed(
        1
      )}MB). Maximum is 10MB.`
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
  folder: string = "centher"
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
      `Upload failed: ${err?.message || "network error"}. Please try again.`
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
      "Upload failed: Cloudinary did not return an image URL."
    );
  }
  return secureUrl;
}
