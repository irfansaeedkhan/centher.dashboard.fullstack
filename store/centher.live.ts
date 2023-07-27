import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CentherLive } from "@/live";
import { IConversation } from "@/live/types";

export interface CentherLiveStore {
  adapter: CentherLive | null;
  setAdapter: (instance: CentherLive) => void;
}

export interface ConversationStore {
  conversations: IConversation[];
  setConversations: (conversations: IConversation[]) => void;
}

export const useCentherLiveStore = create<CentherLiveStore>()(
  devtools(
    (set) => ({
      adapter: null,
      setAdapter: (adapter: CentherLive) => set({ adapter }),
    }),
    { name: "CentherLiveStore" }
  )
);

export const useConversationsStore = create<ConversationStore>()(
  devtools(
    (set) => ({
      conversations: [],
      setConversations: (conversations: IConversation[]) =>
        set({ conversations }),
    }),
    { name: "conversationsStore" }
  )
);
