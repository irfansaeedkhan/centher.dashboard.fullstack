import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";

import { useNotificationsStore } from "@/store/notifications.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SingleNotificationSkeleton from "@/components/loading.skeletons/single.notification";

import {
  SingleNotification,
  useMarkNotificationsPageAsSeen,
} from "./_components";
import { NotificationBell } from "@/assets/svgs";

const Notifications: NextPageWithLayout = () => {
  // Mark notifications page as seen
  useMarkNotificationsPageAsSeen();

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
    <div>
      <div className={sectionName}>Notifications</div>
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => {
          if (
            notification._id === notifications[notifications.length - 1]._id
          ) {
            return (
              <SingleNotification
                ref={lastNotiRef}
                notification={notification}
                key={notification._id}
              />
            );
          }
          return (
            <SingleNotification
              notification={notification}
              key={notification._id}
            />
          );
        })}
      </div>

      {(loading === "loading" || loading === "idle") && (
        <SingleNotificationSkeleton />
      )}

      {loading === "loaded" && notifications.length === 0 && (
        <div>
          <div className="flex justify-center mt-[60px]">
            <NotificationBell />
          </div>
          <div className="flex justify-center mt-[35px]">
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
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Notifications">{page}</AllPagesWrapper>;
};

export default Notifications;

const sectionName = ctl(
  `animationTextHeading mb-8 lg:!text-[34px] sm:!text-2xl`
);
