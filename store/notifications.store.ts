// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { LoadingState } from "@/models/common";
import { Notification } from "@/assets/svgs";

// TODO: Mubashir - Improve how the notifications are handled for different days
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

      updateOffset: () =>
        set((state) => ({ offset: state.notifications.length })),

      notifications: [],

      fetchNotifications: async () => {
        try {
          set({ loading: "loading" });
          const offset = get().offset;
          const limit = get().limit;

          const url = `/api/notifications?offset=${offset}&limit=${limit}`;

          const { data } = await axiosNodeApi.get(url);

          set((state) => {
            const filteredNotifications = state.notifications.filter(
              (stateNotification) =>
                !data.notifications.some(
                  (notification: Notification) =>
                    stateNotification._id === notification._id
                )
            );
            const notifications = [
              ...filteredNotifications,
              ...data.notifications,
            ];

            return {
              notifications,
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

          const { data } = await axiosNodeApi.get(
            `/api/notifications?limit=${limit}`
          );

          set((state) => {
            // Filter out notifications that are already in the store
            const filteredNotifications = state.notifications.filter(
              (stateNotification) =>
                !data.notifications.some(
                  (notification: Notification) =>
                    stateNotification._id === notification._id
                )
            );
            const notifications = [
              ...data.notifications,
              ...filteredNotifications,
            ];

            return {
              notifications,
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
          await axiosNodeApi.patch(`/api/notifications/${id}`);
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
          await axiosNodeApi.patch(`/api/notifications`);
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
  user: {
    _id: string;
    account_address: string;
  };
}

interface NotificationBy {
  _id: string;
  display_name: string;
  profile_image: {
    path: string;
    object_name: string;
  };
  account_address: string;
}

interface BaseNotification {
  _id: string;

  for: string;

  by: NotificationBy;

  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

interface PostLikeNotification extends BaseNotification {
  type: "post_like";
  post: NotificationPost;
}

interface PostReplyNotification extends BaseNotification {
  type: "post_reply";
  post: NotificationPost;
}

interface FollowNotification extends BaseNotification {
  type: "follow";
}

interface NewReferralNotification extends BaseNotification {
  type: "new_referral";
}

export type Notification =
  | PostLikeNotification
  | PostReplyNotification
  | FollowNotification
  | NewReferralNotification;
