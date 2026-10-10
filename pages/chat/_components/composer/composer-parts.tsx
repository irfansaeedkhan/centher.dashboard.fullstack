import React from "react";
import Image from "next/image";
import { formatFileSize } from "../message/media-bubbles";

export interface PendingAttachment {
  file: File;
  previewUrl: string | null;
  kind: "image" | "video" | "audio" | "file";
}

/** Pre-send attachment thumbnails with remove buttons. */
export const AttachmentPreview: React.FC<{
  items: PendingAttachment[];
  onRemove: (index: number) => void;
}> = ({ items, onRemove }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-2 flex gap-2 overflow-x-auto">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-elevation-2"
        >
          {item.kind === "image" && item.previewUrl ? (
            <Image
              src={item.previewUrl}
              alt={item.file.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-1">
              <span className="text-2xl">
                {item.kind === "video"
                  ? "🎬"
                  : item.kind === "audio"
                  ? "🎵"
                  : "📎"}
              </span>
              <span className="mt-1 w-full truncate text-center text-[10px] text-gray-shade-7">
                {item.file.name}
              </span>
            </div>
          )}
          <button
            onClick={() => onRemove(i)}
            aria-label="Remove attachment"
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

/** Voice message recorder (MediaRecorder → audio/webm blob). */
export const VoiceRecorder: React.FC<{
  onDone: (blob: Blob, durationSec: number) => void;
  onCancel: () => void;
}> = ({ onDone, onCancel }) => {
  const [recording, setRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = React.useRef(0);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const dur = Math.max(
          1,
          Math.round((Date.now() - startRef.current) / 1000)
        );
        onDone(blob, dur);
      };
      recorderRef.current = rec;
      startRef.current = Date.now();
      rec.start();
      setRecording(true);
      timerRef.current = setInterval(() => {
        setSeconds(Math.round((Date.now() - startRef.current) / 1000));
      }, 500);
    } catch {
      setError("Microphone access denied. Please allow microphone access.");
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    recorderRef.current?.stop();
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const mm = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
    2,
    "0"
  )}`;

  return (
    <div className="mb-2 flex items-center gap-3 rounded-lg bg-elevation-1 px-3 py-2">
      {!recording ? (
        <>
          <button
            onClick={start}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white"
            aria-label="Start recording"
          >
            🎙
          </button>
          <span className="text-xs text-gray-shade-7">
            Tap to record a voice message
          </span>
          <button
            onClick={onCancel}
            className="ml-auto text-xs text-gray-shade-7 hover:text-white"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
          <span className="text-sm font-medium text-white">{mm}</span>
          <span className="text-xs text-gray-shade-7">Recording…</span>
          <button
            onClick={stop}
            className="bg-primary ml-auto rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
          >
            Send
          </button>
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setRecording(false);
              recorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
              onCancel();
            }}
            className="text-xs text-gray-shade-7 hover:text-white"
          >
            Discard
          </button>
        </>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export { formatFileSize };
