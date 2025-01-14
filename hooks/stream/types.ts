export type TStreamLoader = "connecting" | "connected" | "failed" | "none";
export type TSendStreamLoader = TStreamLoader | "trackEnded" | "producerClosed";
