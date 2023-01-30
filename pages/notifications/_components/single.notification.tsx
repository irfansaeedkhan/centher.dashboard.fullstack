// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import clsx from "clsx";

// App imports
import {
  Notification,
  useNotificationsStore,
} from "@/store/notifications.store";
import { AppRoutes } from "@/constants/app.routes";

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

  let notificationLink: JSX.Element | JSX.Element[] | null = null;
  if (notification.type === "post_like" || notification.type === "post_reply") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.feed.single_post,
          query: { post_id: notification.post._id },
        }}
        className="text-sm leading-3 text-white hover:text-brand-primary"
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
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="text-sm leading-3 text-white hover:text-brand-primary"
      >
        {notification.by.display_name} started following you.
      </Link>
    );
  } else if (notification.type === "new_referral") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="text-sm leading-3 text-white hover:text-brand-primary"
      >
        {notification.by.display_name} has joined your network.
      </Link>
    );
  } else if (notification.type === "centher_purchase_ntr") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="text-sm leading-3 text-white hover:text-brand-primary"
      >
        <>
          {notification.amount} NTR network rewards from{" "}
          {notification.by.display_name}
        </>
      </Link>
    );
  } else if (notification.type === "centher_purchase_busd") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="text-sm leading-3 text-white hover:text-brand-primary"
      >
        <>
          {notification.amount} BUSD network rewards from{" "}
          {notification.by.display_name}
        </>
      </Link>
    );
  }

  /**
   * {notification.amount} BUSD network rewards from{" "}
        {notification.by.display_name}
   */
  return (
    <div
      ref={ref}
      className={clsx(
        `w-full max-w-[1005px] min-h-[76px] fsm:px-6 px-3 py-4 flex justify-between gap-2`,
        notification.status === "unread"
          ? `bg-background-shade-2`
          : `bg-background-shade-3`,
        index === length - 1 ? `rounded-b-xl` : `border-b border-gray-shade-3`,
        index === 0 && `rounded-t-xl`
      )}
      onClick={readNotification}
    >
      <div className="flex items-center gap-2">
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: { account_address: notification.by.account_address },
          }}
          className="flex flex-shrink-0"
        >
          <Image
            src={notification.by?.profile_image?.path}
            alt="dp"
            width={44}
            height={44}
            className="rounded-full sm:h-[44px] sm:w-[44px] !h-[40px] !w-[40px] object-cover"
          />
        </Link>
        <div className="flex flex-grow flex-col">
          <span>{notificationLink}</span>
          <p className="fsm:text-sm text-xs text-gray-shade-2 text-end fsm:hidden flex flex-shrink-0">
            {moment(notification.createdAt).format(
              days === "seven" || days === "befor_seven" ? `ll` : `LT`
            )}
          </p>
        </div>
      </div>
      <p className="fsm:text-sm text-xs text-gray-shade-2 text-end fsm:flex flex-shrink-0 hidden">
        {moment(notification.createdAt).format(
          days === "seven" || days === "befor_seven" ? `ll` : `LT`
        )}
      </p>
    </div>
  );
});

SingleNotification.displayName = "SingleNotification";
