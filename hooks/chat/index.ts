import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ProductLive } from "@/live";
import { productLiveoptions } from "@/live/config";
import { IConversation } from "@/live/types";
import { IProductLiveOptions } from "@/live/types/product.live.options";
import { eqAddress } from "@/live/utils/address.utils";
import {
  useProductLiveStore,
  useConversationsStore,
} from "@/store/product.live";
import { getAuthTokens } from "@/lib/auth";
import { customLog } from "@/utils/custom.log";
import useUser from "../use.user";

export const useProductLive = () => {
  const { user } = useUser();
  const router = useRouter();
  const { adapter, setAdapter } = useProductLiveStore((state) => ({
    adapter: state.adapter,
    setAdapter: state.setAdapter,
  }));

  const { conversations, setConversations } = useConversationsStore(
    (state) => ({
      conversations: state.conversations,
      setConversations: state.setConversations,
    })
  );

  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [unreadConversations, setUnreadConversations] = useState<number>(0);

  const token = getAuthTokens()?.access_token;

  const conversationSubscriptionHander = useCallback(
    async (
      adapter: ProductLive,
      updatedConversations: IConversation[],
      account: string
    ) => {
      const newConversations = [...updatedConversations];
      // if (conversations.length > 0) {
      //   conversations.forEach((e) => {
      //     if (newConversations.findIndex((s) => s.id == e.id) == -1) {
      //       newConversations.push(e);
      //     }
      //   });
      // }
      const hasUnreadMessages = getConversationWithMessageStatus(
        newConversations,
        "fetched",
        account
      );

      const unseenMessages = getConversationWithMessageStatus(
        newConversations,
        "seen",
        account
      );

      setUnreadConversations(unseenMessages);
      if (!router.pathname?.includes("chat") && hasUnreadMessages) {
        toast(`You have a new message`);
      }

      const pinnedConversations: IConversation[] = [];
      const unpinnedConversation: IConversation[] = [];

      newConversations.forEach((c) => {
        const myUserConversation = c.user_conversations.find((e) => {
          if (eqAddress(e.user_address, account)) {
            return e;
          }
        });

        if (myUserConversation?.is_pinned) {
          pinnedConversations.push(c);
        } else {
          unpinnedConversation.push(c);
        }
      });

      unpinnedConversation.sort(
        (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)
      );

      const finalArray = [...pinnedConversations, ...unpinnedConversation];
      const promises = finalArray.map((e) => adapter.handleFetchMessages(e.id));
      await Promise.all(promises);

      setConversations(finalArray);
      setConversationLoading(false);
    },
    [setConversations, router.pathname]
  );

  const notificationCallback = useCallback(async (e: any) => {
    //TODO=> this is toast when a new notification receive, create message or ui
    if (e?.length == 1) {
      toast(e[0].title);
    }

    if (e?.length > 1) {
      toast("You have new notifications");
    }
  }, []);

  const handleUnreadNotification = useCallback(
    (e: any[]) => {
      setUnreadNotifications(e?.length);
    },
    [setUnreadNotifications]
  );

  useEffect(() => {
    const subToConversations = async (
      adapter: ProductLive,
      handler: (sdk: ProductLive, args: any, account: string) => void
    ) => {
      await adapter.subToConversations(adapter, handler);
    };

    if (user && !adapter && token) {
      const config: IProductLiveOptions = {
        ...productLiveoptions,
        userAddress: user._id,
        userToken: token,
        eventHandlers: {
          OnNotificationReceived: notificationCallback,
          OnContactChanged: (e) => {},
        },
      };

      const sdkInstance = new ProductLive(config);
      setAdapter(sdkInstance);
      setConversationLoading(true);
      subToConversations(sdkInstance, conversationSubscriptionHander).catch(
        (e) => {
          customLog(["development", "staging"], e);
        }
      );
      sdkInstance
        .subscribeToUnreadNotifications(handleUnreadNotification)
        .catch((e) => customLog(["development", "staging"], e));
    }
  }, [
    handleUnreadNotification,
    user,
    adapter,
    setAdapter,
    conversationSubscriptionHander,
    token,
    notificationCallback,
  ]);

  return {
    adapter,
    conversations,
    conversationLoading,
    unreadNotifications,
    unreadConversations,
  };
};

function getConversationWithMessageStatus(
  conversations: IConversation[],
  status: string,
  account: string
): number {
  return conversations
    .map((e) => e.user_conversations)
    .flat()
    .filter((e) => !eqAddress(e.user_address, account))
    .map((e) => e.messages)
    .flat()
    .filter((e) => {
      return (
        e.activities.filter(
          (a) => eqAddress(account, a.user_address) && a.type == status
        )?.length == 0
      );
    }).length;
}
