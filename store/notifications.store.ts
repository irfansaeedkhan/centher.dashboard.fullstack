import { create } from "zustand";
import { devtools } from "zustand/middleware";
import moment from "moment";

import { axiosApiCenther } from "@/utils/axios";
import { LoadingState } from "@/models/common";
import { Notification } from "@/assets/svgs";

export interface NotificationsStore {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  fetchNewNotifications: () => Promise<void>;
  offset: number;
  updateOffset: () => void;
  limit: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: LoadingState;
}

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",

      limit: 10,

      offset: 0,

      updateOffset: () => {
        set((state) => ({ offset: state.notifications.length }));
      },

      notifications: [],

      fetchNotifications: async () => {
        try {
          set({ loading: "loading" });
          const offset = get().offset;
          const limit = get().limit;

          const url = `/api/notifications?offset=${offset}&limit=${limit}`;

          const { data } = await axiosApiCenther.get(url);

          set((state) => {
            const filteredNotifications = state.notifications.filter(
              (stateNotification) =>
                !data.notifications.some(
                  (notification: Notification) =>
                    stateNotification._id === notification._id
                )
            );
            let notificationsArray = [
              ...filteredNotifications,
              ...data.notifications,
            ];

            // Sort by date
            notificationsArray = notificationsArray.sort((a, b) =>
              moment(a.createdAt).isBefore(moment(b.createdAt)) ? 1 : -1
            );

            return {
              notifications: notificationsArray as Notification[],
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchNewNotifications: async () => {
        try {
          const limit = get().limit;
          const { data } = await axiosApiCenther.get(
            `/api/notifications?limit=${limit}`
          );

          get().markAllAsRead();

          set((state) => {
            // Filter out notifications that are already in the store
            const filteredNotifications = state.notifications.filter(
              (stateNotification) =>
                !data.notifications.some(
                  (notification: Notification) =>
                    stateNotification._id === notification._id
                )
            );
            let notificationsArray = [
              ...data.notifications,
              ...filteredNotifications,
            ];

            set(() => ({
              notifications: notificationsArray,
            }));

            // Sort by date
            notificationsArray = notificationsArray.sort((a, b) =>
              moment(a.createdAt).isBefore(moment(b.createdAt)) ? 1 : -1
            );

            return {
              notifications: notificationsArray as Notification[],
              loading: "loaded",
            };
          });
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      markAsRead: async (id) => {
        try {
          await axiosApiCenther.patch(`/api/notifications/${id}`);
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification._id === id
                ? { ...notification, status: "read" }
                : notification
            ),
          }));
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      markAllAsRead: async () => {
        try {
          await axiosApiCenther.patch(`/api/notifications`);
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "NotificationsStore" }
  )
);

interface NotificationPost {
  _id: string;
  user_id: string;
}

interface NotificationBy {
  _id: string;
  display_name: string;
  profile_image: string;
  is_verified: boolean;
}

interface BaseNotification {
  _id: string;

  for: string;

  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

interface PostLikeNotification extends BaseNotification {
  type: "post_like";
  by: NotificationBy;
  post: NotificationPost;
}

interface ReplyLikeNotification extends BaseNotification {
  type: "reply_like";
  by: NotificationBy;
  post: NotificationPost;
}

interface ReplyToReplyNotification extends BaseNotification {
  type: "reply_reply";
  by: NotificationBy;
  post: NotificationPost;
}

interface PostReplyNotification extends BaseNotification {
  type: "post_reply";
  by: NotificationBy;
  post: NotificationPost;
}

interface FollowNotification extends BaseNotification {
  type: "follow";
  by: NotificationBy;
}

interface NewReferralNotification extends BaseNotification {
  type: "new_referral";
  by: NotificationBy;
}

interface NTRNetworkRewardsNotification extends BaseNotification {
  type: "centher_purchase_ntr";
  by: NotificationBy;
  amount: number;
  level: number;
}

interface BUSDNetworkRewardsNotification extends BaseNotification {
  type: "centher_purchase_busd";
  by: NotificationBy;
  amount: number;
  level: number;
}

interface PresaleBookingNotification extends BaseNotification {
  type: "presale_booking";
  trx_hash: string;
  paid_amount: number;
  paid_token_name: string;
  paid_token_symbol: string;
  receivable_amount: number;
  receivable_token_name: string;
  receivable_token_symbol: string;
  receivable_in_round: number;
  by: {
    display_name: NotificationBy["display_name"];
    profile_image: NotificationBy["profile_image"];
    is_verified: NotificationBy["is_verified"];
  };
}

interface PresaleBookingReferralNotification extends BaseNotification {
  type: "presale_booking_referral";
  trx_hash: string;
  reward_amount: number;
  reward_token_name: string;
  reward_token_symbol: string;
  level: number;
  by: {
    display_name: NotificationBy["display_name"];
    profile_image: NotificationBy["profile_image"];
    is_verified: NotificationBy["is_verified"];
  };
}

export type Notification =
  | PostLikeNotification
  | PostReplyNotification
  | FollowNotification
  | NewReferralNotification
  | NTRNetworkRewardsNotification
  | ReplyLikeNotification
  | ReplyToReplyNotification
  | BUSDNetworkRewardsNotification
  | PresaleBookingNotification
  | PresaleBookingReferralNotification;
