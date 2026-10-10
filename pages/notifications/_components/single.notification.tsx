import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
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
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import cn from "@/utils/cn";

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
  const verificationTick = useVerificationTick({ user: notification.by });

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
        const link = getNotificationUrl(notification);
        if (!link) return;
        router.push(link);
      }}
    >
      <div className="flex items-center gap-2">
        <span
          onClick={(e) => {
            e.stopPropagation();
            const link = getNotificationImageUrl(notification);
            if (!link) return;
            router.push(link);
          }}
          className="flex flex-shrink-0"
        >
          <Image
            src={notification.by.profile_image}
            alt="dp"
            width={44}
            height={44}
            className="!h-[40px] !w-[40px] rounded-full object-cover fsm:h-[44px] fsm:w-[44px]"
          />
        </span>
        <div className="flex flex-grow flex-col">
          <div>
            <div
              className={clsx(`inline-block items-center text-sm text-white`)}
            >
              <span className="inline-block w-full">
                {getNotificationMessage(notification, verificationTick)}
              </span>
            </div>
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

const getNotificationMessage = (
  notification: Notification,
  verificationTick: string | null = null
) => {
  let NotificationByName: JSX.Element | null = null;

  if (
    notification.type !== "presale_booking" &&
    notification.type !== "presale_booking_referral"
  ) {
    NotificationByName = (
      <Link
        onClick={(e) => {
          e.stopPropagation();
        }}
        href={{
          pathname: AppRoutes.profile.user_id,
          query: { user_id: notification.by._id },
        }}
        className={cn(
          `text-gradient-hover break-words`,
          !notification.by.display_name.includes(" ") &&
            notification.by.display_name.length > 20 &&
            `word-break inline break-words md:w-full`,
          `max-w-[calc(100vw-100px)] [@media(min-width:1000px)]:max-w-[730px] [@media(min-width:560px)_and_(max-width:999px)]:max-w-[60vw]`
        )}
      >
        <span className="font-medium" title={notification.by.display_name}>
          {sliceDisplayName(notification.by.display_name)}
        </span>
        {!!verificationTick ? (
          <span className="verifiedIcon inline-block h-[15px] w-[20px] min-w-[20px] fsm:h-[20px]">
            <Image
              src={verificationTick}
              alt={
                notification.by.membership.status === "citizen"
                  ? "Citizen"
                  : "Verified"
              }
              width={16}
              height={16}
              className="ml-0.5 mt-0.5 fsm:mt-[6px]"
            />
          </span>
        ) : null}
      </Link>
    );
  }

  switch (notification.type) {
    case "post_like":
      return <>{NotificationByName} liked your post.</>;
    case "post_reply":
      return <>{NotificationByName} replied to your post.</>;
    case "reply_like":
      return <>{NotificationByName} liked your reply.</>;
    case "reply_reply":
      return <>{NotificationByName} has replied to your reply.</>;
    case "follow":
      return <>{NotificationByName} started following you.</>;
    case "new_referral":
      return <>{NotificationByName} joined your network.</>;
    case "mention_in_post":
      return <>{NotificationByName} mentioned you in a post.</>;
    case "invitation_received":
      return <>{NotificationByName} invited you to join team.</>;
    case "centher_purchase_ntr":
      return (
        <>
          {notification.amount} NTR network rewards from {NotificationByName}
        </>
      );
    case "centher_purchase_busd":
      return (
        <>
          {notification.amount} BUSD network rewards from {NotificationByName}
        </>
      );
    case "presale_booking":
      return (
        <>
          Your{" "}
          <span className="font-medium">
            {notification.receivable_token_symbol}
          </span>{" "}
          tokens are booked! You will be able to claim your{" "}
          <span className="font-medium">
            {notification.receivable_amount.toString().includes(".")
              ? notification.receivable_amount.toFixed(2)
              : notification.receivable_amount}{" "}
            {notification.receivable_token_symbol}
          </span>{" "}
          when{" "}
          <span className="font-medium">
            round {notification.receivable_in_round}
          </span>{" "}
          starts.
        </>
      );
    case "presale_booking_referral":
      return (
        <>
          You got a referral commission of{" "}
          <span className="font-medium">
            {notification.reward_amount.toString().includes(".")
              ? notification.reward_amount.toFixed(2)
              : notification.reward_amount}{" "}
            {notification.reward_token_symbol}
          </span>{" "}
          from presale booking. Check it out.
        </>
      );
    default:
      return "";
  }
};

const getNotificationUrl = (
  notification: Notification
): LinkProps["href"] | null => {
  switch (notification.type) {
    case "invitation_received":
      return {
        pathname: AppRoutes.settings.team,
      };
    case "post_like":
    case "post_reply":
    case "reply_like":
    case "reply_reply":
      if (!notification.post) return null;
      return {
        pathname: AppRoutes.feed.single_post,
        query: { post_id: notification.post._id },
      };
    case "follow":
    case "new_referral":
    case "centher_purchase_busd":
    case "centher_purchase_ntr":
      return {
        pathname: AppRoutes.profile.user_id,
        query: { user_id: notification.by._id },
      };
    case "presale_booking":
      return {
        pathname: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        query: { tab: "my-bookings" },
      };
    case "presale_booking_referral":
      return {
        pathname: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        query: { tab: "my-rewards" },
      };
    case "mention_in_post":
      if (!notification.post) return null;
      return {
        pathname: AppRoutes.feed.single_post,
        query: { post_id: notification.post._id },
      };
    default:
      return null;
  }
};

const getNotificationImageUrl = (
  notification: Notification
): LinkProps["href"] | null => {
  switch (notification.type) {
    case "invitation_received":
      return {
        pathname: AppRoutes.profile.user_id,
        query: { user_id: notification.by._id },
      };
    case "post_like":
    case "post_reply":
    case "reply_like":
    case "reply_reply":
    case "follow":
    case "new_referral":
    case "centher_purchase_busd":
    case "centher_purchase_ntr":
    case "mention_in_post":
      return {
        pathname: AppRoutes.profile.user_id,
        query: { user_id: notification.by._id },
      };
    case "presale_booking":
      return {
        pathname: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        query: { tab: "my-bookings" },
      };
    case "presale_booking_referral":
      return {
        pathname: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        query: { tab: "my-rewards" },
      };
    default:
      return null;
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
