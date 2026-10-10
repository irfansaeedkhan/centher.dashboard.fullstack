/**
 * Phase 11: Cloudinary media upload tests.
 * Tests config detection, file validation, and the upload request shape
 * (fetch is mocked — no real Cloudinary calls).
 */
import {
  isCloudinaryConfigured,
  validateImageFile,
  uploadImage,
  CloudinaryNotConfiguredError,
  CloudinaryUploadError,
  MAX_IMAGE_BYTES,
} from "@/lib/media/cloudinary";

const CLOUD = "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME";
const PRESET = "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET";

const OLD_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...OLD_ENV };
  delete process.env[CLOUD];
  delete process.env[PRESET];
  (global.fetch as any) = jest.fn();
});

afterAll(() => {
  process.env = OLD_ENV;
});

const img = (type: string, size = 1024) =>
  new File([new Uint8Array(size)], "pic.jpg", { type });

describe("isCloudinaryConfigured", () => {
  it("false when nothing is set", () => {
    expect(isCloudinaryConfigured()).toBe(false);
  });
  it("false when only the cloud name is set", () => {
    process.env[CLOUD] = "demo";
    expect(isCloudinaryConfigured()).toBe(false);
  });
  it("true when both are set", () => {
    process.env[CLOUD] = "demo";
    process.env[PRESET] = "centher_uploads";
    expect(isCloudinaryConfigured()).toBe(true);
  });
});

describe("validateImageFile", () => {
  it("accepts jpeg/png/gif/webp", () => {
    for (const t of ["image/jpeg", "image/png", "image/gif", "image/webp"]) {
      expect(() => validateImageFile(img(t))).not.toThrow();
    }
  });
  it("rejects non-image types", () => {
    expect(() => validateImageFile(img("video/mp4"))).toThrow(
      CloudinaryUploadError
    );
    expect(() => validateImageFile(img("application/pdf"))).toThrow(
      CloudinaryUploadError
    );
  });
  it("rejects files over 10MB", () => {
    expect(() =>
      validateImageFile(img("image/png", MAX_IMAGE_BYTES + 1))
    ).toThrow(/too large/i);
  });
  it("accepts a file exactly at the limit", () => {
    expect(() =>
      validateImageFile(img("image/png", MAX_IMAGE_BYTES))
    ).not.toThrow();
  });
});

describe("uploadImage", () => {
  const cfg = () => {
    process.env[CLOUD] = "demo-cloud";
    process.env[PRESET] = "centher_uploads";
  };

  it("throws CloudinaryNotConfiguredError when env is missing", async () => {
    await expect(uploadImage(img("image/png"))).rejects.toThrow(
      CloudinaryNotConfiguredError
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("POSTs FormData to the unsigned endpoint and returns secure_url", async () => {
    cfg();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        secure_url: "https://res.cloudinary.com/x/img.jpg",
      }),
    });

    const url = await uploadImage(img("image/png"), "centher/posts");

    expect(url).toBe("https://res.cloudinary.com/x/img.jpg");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [endpoint, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(endpoint).toBe(
      "https://api.cloudinary.com/v1_1/demo-cloud/image/upload"
    );
    expect(opts.method).toBe("POST");
    const form = opts.body as FormData;
    expect(form.get("upload_preset")).toBe("centher_uploads");
    expect(form.get("folder")).toBe("centher/posts");
    expect(form.get("file")).toBeInstanceOf(File);
  });

  it("throws CloudinaryUploadError on API failure", async () => {
    cfg();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: "Invalid preset" } }),
    });
    await expect(uploadImage(img("image/png"))).rejects.toThrow(
      /Invalid preset/
    );
  });

  it("throws CloudinaryUploadError when secure_url is missing", async () => {
    cfg();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    await expect(uploadImage(img("image/png"))).rejects.toThrow(
      /did not return an image URL/
    );
  });

  it("throws CloudinaryUploadError on network failure", async () => {
    cfg();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("boom"));
    await expect(uploadImage(img("image/png"))).rejects.toThrow(/boom/);
  });

  it("validates before hitting the network", async () => {
    cfg();
    await expect(uploadImage(img("video/mp4"))).rejects.toThrow(
      CloudinaryUploadError
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
