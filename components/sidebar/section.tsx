import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useCountsStore } from "@/store/counts.store";
import { LoggedInUser } from "@/models/user";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { SidebarSection } from "./shared";

export interface SectionProps {
  user: LoggedInUser | undefined;
  section: SidebarSection;
  onClose?: () => void;
}

export const Section: React.FC<SectionProps> = (props) => {
  const { user } = useUser();
  const router = useRouter();
  const counts = useCountsStore((state) => state.counts);

  return (
    <div className={`flex flex-col gap-1 px-3`}>
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
                  "gradient-border-3 w-full !rounded-full px-[1.5px]"
              )}
            >
              <div
                className={clsx(
                  item.activeList.indexOf(router.pathname) !== -1
                    ? "w-full bg-black-shade-7"
                    : "hover:bg-black-shade-7/50",
                  "group flex items-center justify-between rounded-full"
                )}
              >
                <div className={`flex items-center gap-2 px-3 py-[6px]`}>
                  <div className="relative">
                    <item.icon
                      className={clsx(
                        "h-5 w-5",
                        item.activeList.indexOf(router.pathname) !== -1
                          ? `stroke-white stroke-[1.5]`
                          : `stroke-gray-shade-7 stroke-[1.5] group-hover:stroke-white`
                      )}
                    />
                    {item.badge === "citizen" && (
                      <Image
                        src="/images/citizen-icon.svg"
                        alt="Citizen"
                        width={10}
                        height={10}
                        className="absolute bottom-0 right-0 inline-block"
                      />
                    )}
                  </div>
                  <Link
                    href={
                      item.available_for === "citizen"
                        ? user?.membership.status === "citizen"
                          ? item.url
                          : AppRoutes.citizenship
                        : item.url
                    }
                    onClick={props.onClose}
                    className={
                      item.activeList.indexOf(router.pathname) !== -1
                        ? `text-sm font-medium text-white`
                        : `text-sm font-medium text-gray-shade-7 group-hover:text-white`
                    }
                  >
                    <span>{item.label}</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
