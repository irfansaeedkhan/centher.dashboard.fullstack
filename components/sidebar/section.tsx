import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { useCountsStore } from "@/store/counts.store";
import { LoggedInUser } from "@/models/user";

import { SidebarSection } from "./shared";

export interface SectionProps {
  user: LoggedInUser | undefined;
  section: SidebarSection;
  onClose?: () => void;
}

export const Section: React.FC<SectionProps> = (props) => {
  const router = useRouter();
  const counts = useCountsStore((state) => state.counts);

  return (
    <div className={`flex flex-col gap-1`}>
      <span
        className={`pl-6 pr-4 text-[11px] font-semibold text-gray-shade-11`}
      >
        {props.section.label}
      </span>
      <div className={`flex flex-col gap-[2px]`}>
        {props.section.items.map((item) => {
          let count: number = counts[item.countType ?? "none"];

          if (item.countType === "notifications") {
            count = props.user?.has_seen_notifications_page ? 0 : count;
          }

          return (
            <div
              key={item.label}
              className={clsx(
                item.activeList.indexOf(router.pathname) !== -1 &&
                  "bg-black-shade-7",
                "flex items-center justify-between py-[6px] pl-6 pr-4"
              )}
            >
              <div className={`flex items-center gap-2`}>
                <item.icon
                  className={clsx(
                    "h-5 w-5",
                    item.activeList.indexOf(router.pathname) !== -1
                      ? `stroke-white stroke-[1.5]`
                      : `stroke-gray-shade-7 stroke-[1.5]`
                  )}
                />
                <Link
                  href={item.url}
                  onClick={props.onClose}
                  className={
                    item.activeList.indexOf(router.pathname) !== -1
                      ? `text-sm font-medium text-white`
                      : `text-sm font-medium text-gray-shade-7`
                  }
                >
                  {item.label}
                </Link>
              </div>
              {!!count && props.user && (
                <span className="flex h-5 w-9 items-center justify-center rounded-lg bg-brand-primary px-2 py-[2px] text-sm font-semibold text-black-shade-7">
                  {count}
                </span>
              )}
              {item.label === "Launchpad" && (
                <span className="flex h-5 w-[52px] flex-shrink-0 items-center justify-center rounded-lg bg-red-shade-1/[0.16] text-[10px] font-semibold leading-3 text-red-shade-1">
                  Hot 🔥
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
