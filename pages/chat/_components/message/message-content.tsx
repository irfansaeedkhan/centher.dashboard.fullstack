import React from "react";
import clsx from "clsx";
import type { ChatMessage } from "@/lib/chat/types";
import {
  AudioBubble,
  FileBubble,
  ImageBubble,
  VideoBubble,
  VoiceBubble,
} from "./media-bubbles";

/** Small quoted preview of the message being replied to. */
export const ReplyPreview: React.FC<{
  reply: NonNullable<ChatMessage["reply_to"]>;
  mine: boolean;
}> = ({ reply, mine }) => (
  <div
    className={clsx(
      "mb-2 rounded-lg border-l-2 px-2 py-1",
      mine ? "border-white/60 bg-white/10" : "border-primary bg-elevation-2"
    )}
  >
    <p className="text-primary text-[11px] font-semibold">
      {reply.sender_name}
    </p>
    <p className="truncate text-xs text-white/70">
      {reply.kind === "text"
        ? reply.body
        : `[${reply.kind}] ${reply.body || ""}`}
    </p>
  </div>
);

/** Read-receipt ticks: ✓ sent, ✓✓ delivered/read. */
export const MessageStatus: React.FC<{ status: string; mine: boolean }> = ({
  status,
  mine,
}) => {
  if (!mine) return null;
  return (
    <span
      className={clsx(
        "ml-1 text-[10px]",
        status === "read" ? "text-sky-400" : "text-white/60"
      )}
      title={status}
    >
      {status === "sent" ? "✓" : "✓✓"}
    </span>
  );
};

/** Routes a message to the right bubble renderer by kind. */
export const MessageContent: React.FC<{
  message: ChatMessage;
  onOpenImage: () => void;
}> = ({ message, onOpenImage }) => {
  const { kind, attachment, body } = message;

  if (message.is_deleted) {
    return (
      <p className="text-sm italic text-white/50">This message was deleted</p>
    );
  }

  if (kind === "image" && attachment) {
    return (
      <div>
        <ImageBubble attachment={attachment} onOpen={onOpenImage} />
        {body?.trim() && (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">{body}</p>
        )}
      </div>
    );
  }
  if (kind === "video" && attachment) {
    return (
      <div>
        <VideoBubble attachment={attachment} />
        {body?.trim() && (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">{body}</p>
        )}
      </div>
    );
  }
  if (kind === "audio" && attachment) {
    return <AudioBubble attachment={attachment} />;
  }
  if (kind === "voice" && attachment) {
    return <VoiceBubble attachment={attachment} />;
  }
  if (kind === "file" && attachment) {
    return <FileBubble attachment={attachment} />;
  }
  // Fallback: attachment without a renderer, or plain text.
  return (
    <div>
      {attachment && <FileBubble attachment={attachment} />}
      <p className="whitespace-pre-wrap break-words text-sm">{body}</p>
    </div>
  );
};
