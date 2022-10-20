import create from "zustand";
import { devtools } from "zustand/middleware";

export interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set) => ({
      notifications: [],
      addNotification: (notification: Notification) =>
        set((state) => {
          const filtered = state.notifications.filter(
            (n) => n._id !== notification._id
          );
          return { notifications: [notification, ...filtered] };
        }),
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
  profile_picture: {
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
