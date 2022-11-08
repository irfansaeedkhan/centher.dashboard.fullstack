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
import clsx from "clsx";

interface SingleNotificationProps {
  notification: Notification;
  length: number;
  index: number;
  days: string;
}

export const SingleNotification = React.forwardRef<
  HTMLDivElement,
  SingleNotificationProps
>(({ notification, length, index, days }, ref) => {
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
        className="text-sm text-white hover:text-brand-primary"
      >
        {notification.by.display_name}{" "}
        {notification.type === "post_like"
          ? "liked "
          : notification.type === "post_reply" && "replied to"}{" "}
        your post.
      </Link>
    );
  } else if (notification.type === "follow") {
    notificationLink = (
      <Link
        href={`/profile/${notification.by.account_address}`}
        className="text-sm text-white hover:text-brand-primary"
      >
        {notification.by.display_name} started following you.
      </Link>
    );
  } else if (notification.type === "new_referral") {
    notificationLink = (
      <Link
        href={`/profile/${notification.by.account_address}`}
        className="text-sm text-white hover:text-brand-primary"
      >
        {notification.by.display_name} has joined your network.
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={clsx(
        `w-full max-w-[1005px] h-[104px] p-6 flex justify-between`,
        notification.status === "unread"
          ? `bg-background-shade-2`
          : `bg-background-shade-3`,
        index === length - 1 ? `rounded-b-xl` : `border-b border-gray-shade-3`,
        index === 0 && `rounded-t-xl`
      )}
      onClick={readNotification}
    >
      <div className="flex items-center gap-2">
        <Link href={`/profile/${notification.by.account_address}`} className="">
          <Image
            src={notification.by?.profile_image?.path}
            alt="dp"
            width={56}
            height={56}
            className="rounded-full h-[56px] w-[56px] object-cover"
          />
        </Link>

        {notificationLink}
      </div>
      <p className="text-sm text-gray-shade-2 ">
        {moment(notification.createdAt).format(
          days === "seven" || days === "befor_seven" ? `ll` : `LT`
        )}
      </p>
    </div>
  );
});

SingleNotification.displayName = "SingleNotification";
