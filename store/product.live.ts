import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductLive } from "@/live";
import { IConversation } from "@/live/types";

export interface ProductLiveStore {
  adapter: ProductLive | null;
  setAdapter: (instance: ProductLive) => void;
}

export interface ConversationStore {
  conversations: IConversation[];
  setConversations: (conversations: IConversation[]) => void;
}

export const useProductLiveStore = create<ProductLiveStore>()(
  devtools(
    (set) => ({
      adapter: null,
      setAdapter: (adapter: ProductLive) => set({ adapter }),
    }),
    {
      name: "ProductLiveStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);

export const useConversationsStore = create<ConversationStore>()(
  devtools(
    (set) => ({
      conversations: [],
      setConversations: (conversations: IConversation[]) =>
        set({ conversations }),
    }),
    {
      name: "conversationsStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
