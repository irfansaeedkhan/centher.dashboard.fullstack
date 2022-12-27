import { CountType } from "@/store/counts.store";
import { IconProps } from "@/assets/svgs";

export type SidebarData = {
  [key: string]: {
    label: string;
    items: {
      label: string;
      url: string;
      icon: React.FC<IconProps>;
      countType?: CountType;
    }[];
  };
};

export type SidebarSection = SidebarData[keyof SidebarData];
