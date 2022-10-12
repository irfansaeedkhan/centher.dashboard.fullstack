// React, Next, NPM Packages
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { SidebarSection } from "./sidebar.data";
import { AdminSideBarType } from "./admin.sidebar.data";
import { useRouter } from "next/router";

export interface SectionProps {
  section: SidebarSection | AdminSideBarType;
}

export const Section: React.FC<SectionProps> = (props) => {
  const router = useRouter();
  return (
    <div className={sectionWrapper}>
      <span className={sectionLabel}>{props.section.label}</span>
      <div className={sectionWrapper}>
        {props.section.items.map((item) => {
          return (
            <div className={itemWrapper} key={item.label}>
              <item.icon
                className={
                  router.pathname
                    .replaceAll("-", " ")
                    .includes(item.label.toLowerCase())
                    ? itemIconsActive
                    : itemIcons
                }
              />
              <Link href={item.url}>
                <a
                  className={
                    router.pathname
                      .replaceAll("-", " ")
                      .includes(item.label.toLowerCase())
                      ? itemLabelActive
                      : itemLabel
                  }
                >
                  {item.label}
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const sectionWrapper = ctl(`
  flex
  gap-6 
  flex-col
`);

const sectionLabel = ctl(`
  font-bold
  text-[11px] 
  text-gray-shade-7 
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);

const itemLabelActive = ctl(`
  text-sm
  font-semibold 
  text-white 
`);

const itemIcons = ctl(`stroke-gray-shade-8`);

const itemIconsActive = ctl(`stroke-white`);
