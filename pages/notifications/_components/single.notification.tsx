// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

// App imports
import {
  Notification,
  useNotificationsStore,
} from "@/store/notifications.store";

interface SingleNotificationProps {
  notification: Notification;
}

export const SingleNotification = React.forwardRef<
  HTMLDivElement,
  SingleNotificationProps
>(({ notification }, ref) => {
  const markAsRead = useNotificationsStore((state) => state.markAsRead);

  const readNotification = async () => {
    if (notification.status === "unread") {
      markAsRead(notification._id);
    }
  };

  let notificationLink: JSX.Element | null = null;
  if (notification.type === "post_like" || notification.type === "post_reply") {
    notificationLink = (
      <Link
        href={`/feed/${notification.post.user.account_address}/post/${notification.post._id}`}
      >
        <a className="text-sm text-white hover:text-brand-primary">
          {notification.by.display_name}{" "}
          {notification.type === "post_like"
            ? "liked "
            : notification.type === "post_reply" && "replied to"}{" "}
          your post.
        </a>
      </Link>
    );
  } else if (notification.type === "follow") {
    notificationLink = (
      <Link href={`/profile/${notification.by.account_address}`}>
        <a className="text-sm text-white hover:text-brand-primary">
          {notification.by.display_name} started following you.
        </a>
      </Link>
    );
  } else if (notification.type === "new_referral") {
    notificationLink = (
      <Link href={`/profile/${notification.by.account_address}`}>
        <a className="text-sm text-white hover:text-brand-primary">
          {notification.by.display_name} has joined your network.
        </a>
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={
        `w-full max-w-[1005px] h-[104px] p-6 flex justify-between rounded-xl ` +
        (notification.status === "unread"
          ? "bg-background-shade-2"
          : "bg-background-shade-3")
      }
      onClick={readNotification}
    >
      <div className="flex items-center gap-2">
        <Link href={`/profile/${notification.by.account_address}`}>
          <a className="dpImagePreview">
            <Image
              src={notification.by?.profile_image?.path}
              alt="dp"
              width={56}
              height={56}
              className="rounded-full h-[56px] w-[56px] object-cover"
            />
          </a>
        </Link>

        {notificationLink}
      </div>
      <p className="text-sm text-gray-shade-2 ">
        {moment(notification.createdAt).format("LT")}
      </p>
    </div>
  );
});

SingleNotification.displayName = "SingleNotification";
