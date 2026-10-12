import React from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ChatAttachment } from "@/lib/chat/types";

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  ppt: "📊",
  pptx: "📊",
  zip: "🗜️",
  txt: "📃",
  csv: "📊",
  json: "📃",
  md: "📃",
};

export const FileBubble: React.FC<{ attachment: ChatAttachment }> = ({
  attachment,
}) => {
  const ext = attachment.file_name.split(".").pop()?.toLowerCase() ?? "";
  const icon = FILE_ICONS[ext] ?? "📎";
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.file_name}
      className="flex items-center gap-3 rounded-xl bg-elevation-2 p-3 hover:bg-elevation-3"
    >
      <span className="text-3xl">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-white">
          {attachment.file_name}
        </span>
        <span className="block text-xs text-gray-shade-7">
          {formatFileSize(attachment.file_size)} · tap to download
        </span>
      </span>
    </a>
  );
};

export const ImageBubble: React.FC<{
  attachment: ChatAttachment;
  onOpen: () => void;
}> = ({ attachment, onOpen }) => (
  <button onClick={onOpen} className="block overflow-hidden rounded-xl">
    <Image
      src={attachment.url}
      alt={attachment.file_name}
      width={attachment.width ?? 400}
      height={attachment.height ?? 300}
      className="max-h-64 w-auto object-cover"
      unoptimized
    />
  </button>
);

export const VideoBubble: React.FC<{ attachment: ChatAttachment }> = ({
  attachment,
}) => (
  <video
    src={attachment.url}
    controls
    preload="metadata"
    className="max-h-64 w-full rounded-xl"
  />
);

export const AudioBubble: React.FC<{ attachment: ChatAttachment }> = ({
  attachment,
}) => {
  const mins = attachment.duration_sec
    ? `${Math.floor(attachment.duration_sec / 60)}:${String(
        attachment.duration_sec % 60
      ).padStart(2, "0")}`
    : null;
  return (
    <div className="min-w-[220px]">
      {attachment.file_name && (
        <p className="mb-1 truncate text-xs text-white/80">
          {attachment.file_name}
        </p>
      )}
      <audio src={attachment.url} controls className="w-full" />
      {mins && (
        <p className="mt-1 text-right text-[10px] text-white/60">{mins}</p>
      )}
    </div>
  );
};

export const VoiceBubble: React.FC<{ attachment: ChatAttachment }> = ({
  attachment,
}) => {
  const [playing, setPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const secs = attachment.duration_sec ?? 0;
  const label = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(
    2,
    "0"
  )}`;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
  };

  // Fake waveform bars (deterministic from duration).
  const bars = React.useMemo(() => {
    const n = 24;
    const arr: number[] = [];
    let seed = secs * 7919 + 13;
    for (let i = 0; i < n; i++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      arr.push(0.25 + ((seed % 1000) / 1000) * 0.75);
    }
    return arr;
  }, [secs]);

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-lg hover:bg-white/30"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="flex flex-1 items-end gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-white/70"
            style={{ height: `${Math.round(h * 32)}px` }}
          />
        ))}
      </div>
      <span className="text-xs text-white/70">{label}</span>
      <audio
        ref={audioRef}
        src={attachment.url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
};
