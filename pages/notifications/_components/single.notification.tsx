import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import clsx from "clsx";

import {
  Notification,
  useNotificationsStore,
} from "@/store/notifications.store";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface SingleNotificationProps {
  notification: Notification;
  className?: string;
}

export const SingleNotification: React.FC<SingleNotificationProps> = ({
  notification,
  className,
}) => {
  const router = useRouter();
  const markAsRead = useNotificationsStore((state) => state.markAsRead);

  const readNotification = async () => {
    if (notification.status === "unread") {
      markAsRead(notification._id);
    }
  };

  return (
    <div
      className={clsx(
        `flex min-h-[76px] w-full max-w-[1005px] cursor-pointer items-start justify-between gap-2 border-b border-gray-shade-3 px-3 py-4 fsm:px-6`,
        notification.status === "unread"
          ? `bg-background-shade-2`
          : `bg-background-shade-3`,
        className
      )}
      onClick={() => {
        readNotification();
        router.push(getNotificationUrl(notification));
      }}
    >
      <div className="flex items-center gap-2">
        <Link
          onClick={(e) => e.stopPropagation()}
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
            className="!h-[40px] !w-[40px] rounded-full object-cover fsm:h-[44px] fsm:w-[44px]"
          />
        </Link>
        <div className="flex flex-grow flex-col">
          <div>
            <NotificationLink notification={notification} />
          </div>
          <Timestamp
            timestamp={notification.createdAt}
            className="flex fsm:hidden"
          />
        </div>
      </div>
      <Timestamp
        timestamp={notification.createdAt}
        className="hidden fsm:flex"
      />
    </div>
  );
};

const NotificationLink: React.FC<{
  notification: Notification;
}> = ({ notification }) => {
  const verificationTick = useVerificationTick({ user: notification.by });

  return (
    <div className={clsx(`inline-block items-center text-sm text-white`)}>
      {(notification.type === "centher_purchase_ntr" ||
        notification.type === "centher_purchase_busd") && (
        <span>{getNotificationMessage(notification)}</span>
      )}
      <Link
        onClick={(e) => e.stopPropagation()}
        href={{
          pathname: AppRoutes.profile.account_address,
          query: { account_address: notification.by.account_address },
        }}
        className={clsx(
          `break-words hover:text-brand-primary`,
          !notification.by.display_name.includes(" ") &&
            notification.by.display_name.length > 20 &&
            `notifcation-page-displayname inline-block break-words md:w-full`
        )}
      >
        <span className="font-medium" title={notification.by.display_name}>
          {sliceDisplayName(notification.by.display_name)}
        </span>
      </Link>
      {!!verificationTick && (
        <span className="verifiedIcon ml-0.5 inline-block h-[15px] w-[20px] min-w-[20px] fsm:ml-0.5 fsm:h-[20px]">
          <Image
            src={verificationTick}
            alt={"Verified"}
            width={20}
            height={20}
            className="fsm:mt-[5px]"
          />
        </span>
      )}{" "}
      {!(
        notification.type === "centher_purchase_ntr" ||
        notification.type === "centher_purchase_busd"
      ) && <span>{getNotificationMessage(notification)}</span>}
    </div>
  );
};

const getNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case "post_like":
      return "liked your post.";
    case "post_reply":
      return "replied to your post.";
    case "reply_like":
      return "liked your reply.";
    case "reply_reply":
      return "has replied to your reply.";
    case "follow":
      return "started following you.";
    case "new_referral":
      return "joined your network.";
    case "centher_purchase_ntr":
      return `${notification.amount} NTR network rewards from`;
    case "centher_purchase_busd":
      return `${notification.amount} BUSD network rewards from`;
    default:
      return "";
  }
};

const getNotificationUrl = (notification: Notification): LinkProps["href"] => {
  switch (notification.type) {
    case "post_like":
    case "post_reply":
    case "reply_like":
    case "reply_reply":
      return {
        pathname: AppRoutes.feed.single_post,
        query: { post_id: notification.post._id },
      };
    case "follow":
    case "new_referral":
    case "centher_purchase_busd":
    case "centher_purchase_ntr":
      return {
        pathname: AppRoutes.profile.account_address,
        query: { account_address: notification.by.account_address },
      };
    default:
      return {};
  }
};

const Timestamp: React.FC<{ timestamp: string; className?: string }> = ({
  timestamp,
  className,
}) => {
  return (
    <p
      className={clsx(
        "flex-shrink-0 text-end text-xs text-gray-shade-2 fsm:text-sm",
        className
      )}
    >
      {moment(timestamp).format(`ll`)}
    </p>
  );
};
