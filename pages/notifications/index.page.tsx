import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { useNotificationsStore } from "@/store/notifications.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SingleNotificationSkeleton from "@/components/loading.skeletons/single.notification";
import { NotificationBell } from "@/assets/svgs";
import {
  SingleNotification,
  useMarkNotificationsPageAsSeen,
} from "./_components";
import { useCentherLive } from "@/hooks/chat";
import { Notify } from "@/live/types/notification";
import { customLog } from "@/utils/custom.log";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BackButton } from "@/components/button/back-button";

const Notifications: NextPageWithLayout = () => {
  // Mark notifications page as seen
  useMarkNotificationsPageAsSeen();
  const { adapter } = useCentherLive();
  const [notifys, setNotifys] = useState<Notify[]>();
  const { connectedAddress } = useWallet();
  //TODO=> notifys is containes notifications, use it in UI, we can consider topic for notif type
  useEffect(() => {
    const getNotificationHistory = async (
      account: string,
      limit: number,
      skip: number
    ) => {
      const notifications = await adapter?.getNotificationList(
        account,
        limit,
        skip
      );
      setNotifys(notifications);
    };

    const limit = 100;
    const skip = 0;

    if (connectedAddress?.length) {
      getNotificationHistory(connectedAddress, limit, skip).catch((e) =>
        customLog(["development", "staging"], "error in seen messages", e)
      );
    }
  }, [adapter, connectedAddress]);

  const {
    notifications,
    fetchNotifications,
    fetchNewNotifications,
    offset,
    loading,
    updateOffset,
  } = useNotificationsStore((state) => ({
    notifications: state.notifications,
    fetchNotifications: state.fetchNotifications,
    fetchNewNotifications: state.fetchNewNotifications,
    offset: state.offset,
    updateOffset: state.updateOffset,
    loading: state.loading,
  }));

  const [lastNotiRef, _lastNotiInView, lastNotiEntry] = useInView();

  useEffect(() => {
    if (lastNotiEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNotiEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchNotifications();
    }
  }, [fetchNotifications, offset]);

  useEffect(() => {
    fetchNewNotifications();
  }, [fetchNewNotifications]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex">
      <div
        className={clsx(
          "flex flex-grow flex-col items-center justify-center space-y-6"
        )}
      >
        {notifications.length > 0 && (
          <div className="flex w-full max-w-[1005px] flex-col">
            <BackButton />
            <div className={`mb-5 font-bold text-white`}>Notifications</div>

            {notifications.map((notification, index) => {
              return (
                <SingleNotification
                  key={notification._id}
                  notification={notification}
                  className={clsx(
                    index === notifications.length - 1 && `rounded-b-xl`,
                    index === 0 && `rounded-t-xl`
                  )}
                />
              );
            })}

            <div ref={lastNotiRef} />
          </div>
        )}

        {(loading === "loading" || loading === "idle") && (
          <div className="flex w-full max-w-[1005px] flex-col">
            <SingleNotificationSkeleton />
          </div>
        )}
        {loading === "loaded" && notifications.length === 0 && (
          <div>
            <div className="mt-[60px] flex justify-center">
              <NotificationBell />
            </div>
            <div className="mt-[35px] flex justify-center">
              <p className="text-white">No notifications available</p>
            </div>
          </div>
        )}
        {loading === "failed" && (
          <div className="flex justify-center">
            <p className="text-gray-500">Something went wrong!</p>
          </div>
        )}
      </div>
    </div>
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Notifications">{page}</AllPagesWrapper>;
};

export default Notifications;
