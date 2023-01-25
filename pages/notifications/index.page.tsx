import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";
import { BiCheckDouble } from "react-icons/bi";

import { useNotificationsStore } from "@/store/notifications.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SingleNotificationSkeleton from "@/components/loading.skeletons/single.notification";

import {
  SingleNotification,
  useMarkNotificationsPageAsSeen,
} from "./_components";
import { NotificationBell } from "@/assets/svgs";
import clsx from "clsx";

const Notifications: NextPageWithLayout = () => {
  // Mark notifications page as seen
  useMarkNotificationsPageAsSeen();

  const {
    notifications,
    notificationsBeforeSevendays,
    notificationToday,
    notificationYesterday,
    notificationSevenday,
    fetchNotifications,
    fetchNewNotifications,
    offset,
    loading,
    updateOffset,
  } = useNotificationsStore((state) => ({
    notifications: state.notifications,
    notificationsBeforeSevendays: state.notificationsBeforeSevendays,
    notificationToday: state.notificationToday,
    notificationYesterday: state.notificationYesterday,
    notificationSevenday: state.notificationSevenday,
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
          "flex-grow flex items-center justify-center flex-col space-y-6"
          // loading !== "loading" && loading !== "idle" && "space-y-6"
        )}
      >
        {/* Today */}
        {notificationToday.length > 0 && (
          <div className="flex flex-col w-full max-w-[1005px]">
            <div className={sectionName}>Earlier</div>

            {notificationToday.map((notification, index) => {
              if (
                notification._id === notifications[notifications.length - 1]._id
              ) {
                return (
                  <SingleNotification
                    ref={lastNotiRef}
                    length={notificationToday.length}
                    notification={notification}
                    key={notification._id}
                    index={index}
                    days="today"
                  />
                );
              }
              return (
                <SingleNotification
                  length={notificationToday.length}
                  notification={notification}
                  key={notification._id}
                  index={index}
                  days="today"
                />
              );
            })}
          </div>
        )}
        {/* Yesterday */}
        {notificationYesterday.length > 0 && (
          <div className="flex flex-col w-full max-w-[1005px]">
            <div className={sectionName}>Yesterday</div>

            {notificationYesterday.map((notification, index) => {
              if (
                notification._id === notifications[notifications.length - 1]._id
              ) {
                return (
                  <SingleNotification
                    ref={lastNotiRef}
                    notification={notification}
                    key={notification._id}
                    length={notificationYesterday.length}
                    index={index}
                    days="yesterday"
                  />
                );
              }
              return (
                <SingleNotification
                  length={notificationYesterday.length}
                  notification={notification}
                  key={notification._id}
                  index={index}
                  days="yesterday"
                />
              );
            })}
          </div>
        )}
        {/* Seven days */}
        {notificationSevenday.length > 0 && (
          <div className="flex flex-col w-full max-w-[1005px]">
            <div className={sectionName}>Last 7 Days</div>

            {notificationSevenday.map((notification, index) => {
              if (
                notification._id === notifications[notifications.length - 1]._id
              ) {
                return (
                  <SingleNotification
                    ref={lastNotiRef}
                    notification={notification}
                    key={notification._id}
                    length={notificationSevenday.length}
                    index={index}
                    days="seven"
                  />
                );
              }
              return (
                <SingleNotification
                  length={notificationSevenday.length}
                  notification={notification}
                  key={notification._id}
                  index={index}
                  days="seven"
                />
              );
            })}
          </div>
        )}
        {/* Remaining */}
        {notificationsBeforeSevendays.length > 0 && (
          <div className="flex flex-col w-full max-w-[1005px]">
            <div className={sectionName}>Older</div>
            <div className="flex flex-col">
              {notificationsBeforeSevendays.map((notification, index) => {
                if (
                  notification._id ===
                  notifications[notifications.length - 1]._id
                ) {
                  return (
                    <SingleNotification
                      ref={lastNotiRef}
                      notification={notification}
                      key={notification._id}
                      length={notificationsBeforeSevendays.length}
                      index={index}
                      days="befor_seven"
                    />
                  );
                }
                return (
                  <SingleNotification
                    notification={notification}
                    key={notification._id}
                    length={notificationsBeforeSevendays.length}
                    index={index}
                    days="befor_seven"
                  />
                );
              })}
            </div>
          </div>
        )}
        {(loading === "loading" || loading === "idle") && (
          <div className="flex flex-col w-full max-w-[1005px]">
            <SingleNotificationSkeleton />
          </div>
        )}
        {loading === "loaded" &&
          notifications.length === 0 &&
          notificationToday.length === 0 &&
          notificationSevenday.length === 0 &&
          notificationYesterday.length === 0 &&
          notificationsBeforeSevendays.length === 0 && (
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
    </div>
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Notifications">{page}</AllPagesWrapper>;
};

export default Notifications;

const sectionName = ctl(`text-white font-bold mb-5`);
