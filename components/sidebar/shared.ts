import { CountType } from "@/store/counts.store";
import { IconProps } from "@/assets/svgs";

export type SidebarData = {
  [key: string]: {
    label: string;
    items: {
      label: string;
      url: string;
      icon: React.FC<IconProps>;
      activeList: string[];
      available_for: "all" | "citizen" | "verified";
      countType?: CountType;
    }[];
  };
};

export type SidebarSection = SidebarData[keyof SidebarData];

export type SidebarItem = SidebarSection["items"][number];
