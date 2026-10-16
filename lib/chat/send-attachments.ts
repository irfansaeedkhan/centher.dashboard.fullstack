/**
 * Chat-grill Q17: multi-attachment sends were not atomic. The composer
 * looped upload → register → send per attachment, so if attachment 2 of 3
 * failed, message 1 was already delivered and the retry duplicated it.
 *
 * New flow: upload + register ALL attachments first (phase 1); only then
 * send the messages (phase 2). A failure in phase 1 aborts before anything
 * is sent — no partial sends, no duplicates on retry. The caption still
 * goes on the first message.
 *
 * Deps are injected so this is unit-testable without Cloudinary.
 */
import type { ChatMessageKind } from "./types";
import type { ChatMediaKind } from "@/lib/media/cloudinary";

export interface PreparedAttachment {
  kind: ChatMediaKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  url: string;
  durationSec?: number;
  width?: number;
  height?: number;
  attachmentId: string;
}

export interface UploadResult {
  kind: ChatMediaKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  url: string;
  durationSec?: number;
  width?: number;
  height?: number;
}

export interface AttachmentDeps {
  upload: (file: File) => Promise<UploadResult>;
  register: (data: {
    kind: ChatMediaKind;
    mime_type: string;
    file_name: string;
    file_size: number;
    url: string;
    duration_sec?: number;
    width?: number;
    height?: number;
  }) => Promise<{ id: string }>;
  sendMessage: (body: string, opts: { kind: ChatMessageKind; attachment_id: string; reply_to_id?: string }) => Promise<unknown>;
}

/**
 * Phase 1: upload + register every attachment. Throws on the first
 * failure — the caller must not send anything in that case.
 */
export async function prepareAttachments(
  files: File[],
  kinds: ChatMediaKind[],
  deps: Pick<AttachmentDeps, "upload" | "register">
): Promise<PreparedAttachment[]> {
  const prepared: PreparedAttachment[] = [];
  for (let i = 0; i < files.length; i++) {
    const result = await deps.upload(files[i]);
    const att = await deps.register({
      kind: kinds[i] ?? result.kind,
      mime_type: result.mimeType,
      file_name: result.fileName,
      file_size: result.fileSize,
      url: result.url,
      duration_sec: result.durationSec,
      width: result.width,
      height: result.height,
    });
    prepared.push({ ...result, attachmentId: att.id });
  }
  return prepared;
}

/**
 * Phase 2: send one message per prepared attachment (caption on the
 * first). Only call this after prepareAttachments resolved.
 */
export async function sendPreparedAttachments(
  prepared: PreparedAttachment[],
  caption: string,
  replyToId: string | undefined,
  deps: Pick<AttachmentDeps, "sendMessage">
): Promise<void> {
  for (let i = 0; i < prepared.length; i++) {
    const p = prepared[i];
    await deps.sendMessage(i === 0 ? caption : "", {
      kind: p.kind as ChatMessageKind,
      attachment_id: p.attachmentId,
      reply_to_id: replyToId,
    });
  }
}
