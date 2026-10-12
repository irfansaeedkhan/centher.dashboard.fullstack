import React from "react";
import toast from "react-hot-toast";
import { chatApi } from "@/lib/chat/api";
import type { ChatMessage, ChatMessageKind } from "@/lib/chat/types";
import {
  classifyChatFile,
  uploadChatMedia,
  CloudinaryNotConfiguredError,
} from "@/lib/media/cloudinary";
import {
  AttachmentPreview,
  VoiceRecorder,
  type PendingAttachment,
} from "./composer-parts";

/**
 * Phase 15: full chat composer — text, attachments (image/video/audio/file),
 * voice messages, and reply-to quoting.
 */
export const ChatComposer: React.FC<{
  conversationId: string;
  replyingTo: ChatMessage | null;
  onClearReply: () => void;
  onSent: (msg: ChatMessage) => void;
  onTyping: () => void;
}> = ({ conversationId, replyingTo, onClearReply, onSent, onTyping }) => {
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState<PendingAttachment[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [showVoice, setShowVoice] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(
    null
  );
  const fileRef = React.useRef<HTMLInputElement>(null);

  const pickFiles = (files: FileList | null) => {
    if (!files) return;
    const next: PendingAttachment[] = [];
    for (const file of Array.from(files).slice(0, 5)) {
      try {
        const kind = classifyChatFile(file);
        next.push({
          file,
          kind,
          previewUrl: kind === "image" ? URL.createObjectURL(file) : null,
        });
      } catch (e: any) {
        toast.error(e?.message || `Cannot attach ${file.name}`);
      }
    }
    setPending((prev) => [...prev, ...next].slice(0, 5));
  };

  const handleVoiceDone = async (blob: Blob, durationSec: number) => {
    setShowVoice(false);
    const file = new File([blob], `voice-${Date.now()}.webm`, {
      type: "audio/webm",
    });
    await sendWithAttachments([], { voiceFile: file, durationSec });
  };

  const sendWithAttachments = async (
    attachments: PendingAttachment[],
    voice?: { voiceFile: File; durationSec: number }
  ) => {
    setUploading(true);
    try {
      if (voice) {
        setUploadProgress("Uploading voice message…");
        const result = await uploadChatMedia(voice.voiceFile);
        const att = await chatApi.registerAttachment({
          kind: "audio",
          mime_type: result.mimeType,
          file_name: result.fileName,
          file_size: result.fileSize,
          url: result.url,
          duration_sec: voice.durationSec,
        });
        const msg = await chatApi.sendMessage(conversationId, "", {
          kind: "voice",
          attachment_id: att.id,
          reply_to_id: replyingTo?.id,
        });
        onSent(msg);
        onClearReply();
        return;
      }

      // Send each attachment as its own message (caption = draft on first).
      for (let i = 0; i < attachments.length; i++) {
        const item = attachments[i];
        setUploadProgress(
          `Uploading ${i + 1}/${attachments.length}: ${item.file.name}`
        );
        const result = await uploadChatMedia(item.file);
        const att = await chatApi.registerAttachment({
          kind: result.kind,
          mime_type: result.mimeType,
          file_name: result.fileName,
          file_size: result.fileSize,
          url: result.url,
          duration_sec: result.durationSec,
          width: result.width,
          height: result.height,
        });
        const msg = await chatApi.sendMessage(
          conversationId,
          i === 0 ? draft.trim() : "",
          {
            kind: result.kind as ChatMessageKind,
            attachment_id: att.id,
            reply_to_id: replyingTo?.id,
          }
        );
        onSent(msg);
      }
      setPending([]);
      setDraft("");
      onClearReply();
    } catch (e: any) {
      if (e instanceof CloudinaryNotConfiguredError) {
        toast.error("Media uploads are not configured yet.");
      } else {
        toast.error(e?.message || "Could not send attachment");
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSend = async () => {
    if (uploading) return;
    if (pending.length > 0) {
      await sendWithAttachments(pending);
      return;
    }
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    try {
      const msg = await chatApi.sendMessage(conversationId, text, {
        reply_to_id: replyingTo?.id,
      });
      onSent(msg);
      onClearReply();
    } catch (e: any) {
      setDraft(text);
      toast.error(e?.message || "Could not send message");
    }
  };

  const canSend = draft.trim().length > 0 || pending.length > 0;

  return (
    <div className="border-t border-gray-shade-3 px-4 py-3">
      {replyingTo && (
        <div className="border-primary mb-2 flex items-center justify-between rounded-lg border-l-2 bg-elevation-1 px-3 py-2">
          <div className="min-w-0">
            <p className="text-primary text-[11px] font-semibold">
              Replying to {replyingTo.sender?.display_name || "Someone"}
            </p>
            <p className="truncate text-xs text-gray-shade-7">
              {replyingTo.kind === "text"
                ? replyingTo.body
                : `[${replyingTo.kind}]`}
            </p>
          </div>
          <button
            onClick={onClearReply}
            className="text-xs text-gray-shade-7 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {showVoice ? (
        <VoiceRecorder
          onDone={handleVoiceDone}
          onCancel={() => setShowVoice(false)}
        />
      ) : (
        <>
          <AttachmentPreview
            items={pending}
            onRemove={(i) => {
              const item = pending[i];
              if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
              setPending((prev) => prev.filter((_, idx) => idx !== i));
            }}
          />
          {uploadProgress && (
            <p className="mb-2 text-xs text-gray-shade-7">{uploadProgress}</p>
          )}
          <div className="focus-within:gradient-border-3 flex items-center gap-2 !rounded-lg bg-elevation-1 p-[1px]">
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.txt,.csv,.md,.json,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="hidden"
              onChange={(e) => {
                pickFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Attach file"
              className="ml-2 flex-shrink-0 text-xl text-gray-shade-7 hover:text-white disabled:opacity-40"
            >
              📎
            </button>
            <button
              onClick={() => setShowVoice(true)}
              disabled={uploading}
              aria-label="Record voice message"
              className="flex-shrink-0 text-xl text-gray-shade-7 hover:text-white disabled:opacity-40"
            >
              🎙
            </button>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                onTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                pending.length > 0
                  ? "Add a caption (optional)"
                  : "Type a message"
              }
              disabled={uploading}
              className="w-full bg-transparent px-2 py-3 text-sm text-white focus:outline-none disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={uploading || !canSend}
              className="bg-primary mr-2 flex-shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {uploading ? "…" : "Send"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
