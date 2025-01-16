export type TStreamLoader = "connecting" | "connected" | "failed" | "none";
export type TSendStreamLoader = TStreamLoader | "trackEnded" | "producerClosed";
export type Collection = {
  category: string;
  collection: string;
  creatorUser: {
    publicKey: string;
  };
  name: string;
  symbol: string;
};
