/**
 * Tests for chat media upload validation.
 *
 * Regression test for the voice-message bug: VoiceRecorder produces
 * audio/webm, which must classify as "audio" and pass validation.
 * The Cloudinary preset config (dashboard-side) is the other half —
 * see docs/CLOUDINARY_SETUP.md.
 */
import {
  classifyChatFile,
  validateChatFile,
  CHAT_AUDIO_MIMES,
  CHAT_VIDEO_MIMES,
  CHAT_IMAGE_MIMES,
  CHAT_FILE_MIMES,
  CloudinaryUploadError,
  MAX_CHAT_AUDIO_BYTES,
  MAX_CHAT_VIDEO_BYTES,
  MAX_CHAT_FILE_BYTES,
  MAX_IMAGE_BYTES,
} from "./cloudinary";

function makeFile(type: string, size: number = 1024, name = "test"): File {
  // jsdom File supports explicit type.
  return new File(["x".repeat(Math.min(size, 1024))], name, { type });
  // Note: we fake `size` below since File content is truncated for speed.
}

function makeSizedFile(type: string, size: number, name = "test"): File {
  const f = makeFile(type, 1024, name);
  Object.defineProperty(f, "size", { value: size });
  return f;
}

describe("classifyChatFile", () => {
  it("classifies voice recordings (audio/webm) as audio", () => {
    // This is exactly what VoiceRecorder produces via MediaRecorder.
    const file = makeFile("audio/webm", 1024, "voice-123.webm");
    expect(classifyChatFile(file)).toBe("audio");
  });

  it("classifies all audio types as audio", () => {
    for (const mime of CHAT_AUDIO_MIMES) {
      expect(classifyChatFile(makeFile(mime))).toBe("audio");
    }
  });

  it("classifies all video types as video", () => {
    for (const mime of CHAT_VIDEO_MIMES) {
      expect(classifyChatFile(makeFile(mime))).toBe("video");
    }
  });

  it("classifies all image types as image", () => {
    for (const mime of CHAT_IMAGE_MIMES) {
      expect(classifyChatFile(makeFile(mime))).toBe("image");
    }
  });

  it("classifies all document types as file", () => {
    for (const mime of CHAT_FILE_MIMES) {
      expect(classifyChatFile(makeFile(mime))).toBe("file");
    }
  });

  it("rejects unsupported types", () => {
    expect(() => classifyChatFile(makeFile("application/x-msdownload"))).toThrow(
      CloudinaryUploadError,
    );
  });

  it("rejects empty MIME type", () => {
    // Some browsers produce Blobs with empty type — fail honestly.
    expect(() => classifyChatFile(makeFile(""))).toThrow(CloudinaryUploadError);
  });

  it("rejects SVG (stored-XSS risk)", () => {
    expect(() => classifyChatFile(makeFile("image/svg+xml"))).toThrow(
      CloudinaryUploadError,
    );
  });
});

describe("validateChatFile", () => {
  it("accepts a typical voice message (audio/webm, small)", () => {
    const file = makeSizedFile("audio/webm", 500 * 1024, "voice-123.webm");
    expect(validateChatFile(file)).toBe("audio");
  });

  it("accepts video up to 50MB", () => {
    const file = makeSizedFile("video/mp4", 49 * 1024 * 1024, "clip.mp4");
    expect(validateChatFile(file)).toBe("video");
  });

  it("rejects video over 50MB", () => {
    const file = makeSizedFile("video/mp4", 51 * 1024 * 1024, "clip.mp4");
    expect(() => validateChatFile(file)).toThrow(/too large/i);
  });

  it("rejects audio over 25MB", () => {
    const file = makeSizedFile("audio/mpeg", 26 * 1024 * 1024, "song.mp3");
    expect(() => validateChatFile(file)).toThrow(/too large/i);
  });

  it("rejects images over 10MB", () => {
    const file = makeSizedFile("image/png", 11 * 1024 * 1024, "photo.png");
    expect(() => validateChatFile(file)).toThrow(/too large/i);
  });

  it("rejects files over 25MB", () => {
    const file = makeSizedFile(
      "application/pdf",
      26 * 1024 * 1024,
      "doc.pdf",
    );
    expect(() => validateChatFile(file)).toThrow(/too large/i);
  });

  it("size caps match the exported constants", () => {
    expect(MAX_CHAT_VIDEO_BYTES).toBe(50 * 1024 * 1024);
    expect(MAX_CHAT_AUDIO_BYTES).toBe(25 * 1024 * 1024);
    expect(MAX_CHAT_FILE_BYTES).toBe(25 * 1024 * 1024);
    expect(MAX_IMAGE_BYTES).toBe(10 * 1024 * 1024);
  });
});
