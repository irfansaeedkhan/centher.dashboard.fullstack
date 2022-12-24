// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { LoadingState } from "@/models/common";
import { Notification } from "@/assets/svgs";
import moment from "moment";

export interface NotificationsStore {
  notificationsBeforeSevendays: Notification[];
  notifications: Notification[];
  notificationToday: Notification[];
  notificationYesterday: Notification[];
  notificationSevenday: Notification[];
  fetchNotifications: () => Promise<void>;
  fetchNewNotifications: () => Promise<void>;
  offset: number;
  updateOffset: () => void;
  limit: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: LoadingState;
}

const today = moment().format("YYYY-MM-DD");
const yesterday = moment(today).subtract(1, "day").format("YYYY-MM-DD");
const sevenday = moment(today).subtract(7, "day").format("YYYY-MM-DD");

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",

      limit: 10,

      offset: 0,

      updateOffset: () => {
        set((state) => ({ offset: state.notifications.length }));
      },

      notificationsBeforeSevendays: [],
      notifications: [],
      notificationToday: [],
      notificationYesterday: [],
      notificationSevenday: [],

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
            const notificationsArray = [
              ...filteredNotifications,
              ...data.notifications,
            ];

            let filterToday = notificationsArray.filter(
              (props) => moment(props.createdAt).format("YYYY-MM-DD") === today
            );

            filterToday = filterToday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filterYesterday = notificationsArray.filter(
              (props) =>
                moment(props.createdAt).format("YYYY-MM-DD") === yesterday
            );

            filterYesterday = filterYesterday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filterSevenday = notificationsArray.filter(
              (props) =>
                moment(props.createdAt).format("YYYY-MM-DD") < yesterday &&
                moment(props.createdAt).format("YYYY-MM-DD") >= sevenday
            );

            filterSevenday = filterSevenday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filteredMainNotifications = notificationsArray.filter(
              (props) => moment(props.createdAt).format("YYYY-MM-DD") < sevenday
            );

            filteredMainNotifications = filteredMainNotifications.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            return {
              notifications: notificationsArray as Notification[],
              notificationsBeforeSevendays:
                filteredMainNotifications as Notification[],
              notificationToday: filterToday as Notification[],
              notificationYesterday: filterYesterday as Notification[],
              notificationSevenday: filterSevenday as Notification[],
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
            const notificationsArray = [
              ...data.notifications,
              ...filteredNotifications,
            ];

            set(() => ({
              notifications: notificationsArray,
            }));

            let filterToday = notificationsArray.filter(
              (props) => moment(props.createdAt).format("YYYY-MM-DD") === today
            );

            filterToday = filterToday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filterYesterday = notificationsArray.filter(
              (props) =>
                moment(props.createdAt).format("YYYY-MM-DD") === yesterday
            );

            filterYesterday = filterYesterday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filterSevenday = notificationsArray.filter(
              (props) =>
                moment(props.createdAt).format("YYYY-MM-DD") < yesterday &&
                moment(props.createdAt).format("YYYY-MM-DD") >= sevenday
            );

            filterSevenday = filterSevenday.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            let filteredMainNotifications = notificationsArray.filter(
              (props) => moment(props.createdAt).format("YYYY-MM-DD") < sevenday
            );

            filteredMainNotifications = filteredMainNotifications.sort((a, b) =>
              a.status > b.status ? -1 : 1
            );

            return {
              notifications: notificationsArray as Notification[],
              notificationsBeforeSevendays:
                filteredMainNotifications as Notification[],
              notificationToday: filterToday as Notification[],
              notificationYesterday: filterYesterday as Notification[],
              notificationSevenday: filterSevenday as Notification[],
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

interface NTRNetworkRewardsNotification extends BaseNotification {
  type: "centher_purchase_ntr";
}

interface BUSDNetworkRewardsNotification extends BaseNotification {
  type: "centher_purchase_busd";
}

export type Notification =
  | PostLikeNotification
  | PostReplyNotification
  | FollowNotification
  | NewReferralNotification
  | NTRNetworkRewardsNotification
  | BUSDNetworkRewardsNotification;
