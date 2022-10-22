// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { axiosNodeApi } from "@/utils/axios";

export interface NotificationsStore {
  notifications: Notification[];
  fetchNotifications: (offset?: number, limit?: number) => Promise<void>;
  fetchNewNotifications: () => Promise<void>;
  offset: number;
  updateOffset: () => void;
  limit: number;
}

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set) => ({
      notifications: [],
      limit: 10,
      offset: 0,
      updateOffset: () =>
        set((state) => ({ offset: state.notifications.length })),

      fetchNotifications: async (offset, limit) => {
        try {
          let url = "/api/notifications";

          if (offset || limit) {
            url += "?";
            if (offset) url += `offset=${offset}`;
            if (limit) url += `&limit=${limit}`;
          }

          const { data } = await axiosNodeApi.get(url);

          set((state) => {
            const filteredNotifications = data.notifications.filter(
              (notification: Notification) =>
                !state.notifications.some(
                  (stateNotification) =>
                    stateNotification._id === notification._id
                )
            );

            return {
              notifications: [
                ...state.notifications,
                ...filteredNotifications,
              ] as Notification[],
            };
          });
        } catch (error) {
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchNewNotifications: async () => {
        try {
          const { data } = await axiosNodeApi.get("/api/notifications?limit=5");

          set((state) => {
            // Filter out notifications that are already in the store
            const filteredNotifications = data.notifications.filter(
              (notification: Notification) =>
                !state.notifications.some(
                  (stateNotification) =>
                    stateNotification._id === notification._id
                )
            );

            return {
              notifications: [...filteredNotifications, ...state.notifications],
            };
          });
        } catch (error) {
          process.env.APP_ENV !== "production" && console.error(error);
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

interface PostreplyNotification extends BaseNotification {
  type: "post_reply";
  post: NotificationPost;
}

export type Notification = PostLikeNotification | PostreplyNotification;
