// React, Next, NPM Packages
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

export interface SectionProps {
  section: any;
}

export const Section: React.FC<SectionProps> = (props) => {
  return (
    <div className={sectionWrapper}>
      <span className={sectionLabel}>{props.section.label}</span>
      <div className={sectionWrapper}>
        {props.section.items.map((item: any, i: number) => {
          return (
            <div className={itemWrapper} key={i}>
              <item.icon className="stroke-gray-shade-8" />
              <div className={itemlabel}>
                <Link href={item.url}>{item.label}</Link>
              </div>
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

const itemlabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);
