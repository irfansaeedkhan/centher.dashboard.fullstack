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
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

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
        className="block w-[60vw] text-sm leading-3 text-white hover:text-brand-primary md:w-full"
      >
        <span
          className={clsx(
            !notification.by.display_name.includes(" ") &&
              notification.by.display_name.length > 20
              ? "break-words"
              : "overflow-hidden break-words md:w-full"
          )}
        >
          {sliceDisplayName(notification.by.display_name)}
        </span>{" "}
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
        className="block w-[60vw] text-sm leading-3 text-white hover:text-brand-primary md:w-full"
      >
        <span
          title={notification.by.display_name}
          className={clsx(
            !notification.by.display_name.includes(" ") &&
              notification.by.display_name.length > 20
              ? "break-words"
              : "overflow-hidden break-words md:w-full"
          )}
        >
          {sliceDisplayName(notification.by.display_name)}
        </span>{" "}
        started following you.
      </Link>
    );
  } else if (notification.type === "new_referral") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="block w-[60vw] text-sm leading-3 text-white hover:text-brand-primary md:w-full"
      >
        <span
          title={notification.by.display_name}
          className={clsx(
            !notification.by.display_name.includes(" ") &&
              notification.by.display_name.length > 20
              ? "break-words"
              : "overflow-hidden break-words md:w-full"
          )}
        >
          {sliceDisplayName(notification.by.display_name)}
        </span>{" "}
        has joined your network.
      </Link>
    );
  } else if (notification.type === "centher_purchase_ntr") {
    notificationLink = (
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className="block w-[60vw] text-sm leading-3 text-white hover:text-brand-primary md:w-full"
      >
        <>
          {notification.amount} NTR network rewards from{" "}
          <span
            title={notification.by.display_name}
            className={clsx(
              !notification.by.display_name.includes(" ") &&
                notification.by.display_name.length > 20
                ? "break-words"
                : "overflow-hidden break-words md:w-full"
            )}
          >
            {sliceDisplayName(notification.by.display_name)}
          </span>
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
          <span
            title={notification.by.display_name}
            className={clsx(
              notification.by.display_name.includes(" ")
                ? "text-ellipsis line-clamp-1"
                : "block w-full max-w-full overflow-hidden  break-words"
            )}
          >
            {sliceDisplayName(notification.by.display_name)}
          </span>
        </>
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={clsx(
        `flex min-h-[76px] w-full max-w-[1005px] items-start justify-between gap-2 px-3 py-4 fsm:px-6`,
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
            className="!h-[40px] !w-[40px] rounded-full object-cover sm:h-[44px] sm:w-[44px]"
          />
        </Link>
        <div className="flex flex-grow flex-col">
          <span>{notificationLink}</span>
          <p className="flex flex-shrink-0 text-end text-xs text-gray-shade-2 fsm:hidden fsm:text-sm">
            {moment(notification.createdAt).format(
              days === "seven" || days === "befor_seven" ? `ll` : `LT`
            )}
          </p>
        </div>
      </div>
      <p className="hidden flex-shrink-0 text-end text-xs text-gray-shade-2 fsm:flex fsm:text-sm">
        {moment(notification.createdAt).format(
          days === "seven" || days === "befor_seven" ? `ll` : `LT`
        )}
      </p>
    </div>
  );
});

SingleNotification.displayName = "SingleNotification";
