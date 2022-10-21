import { IconProps } from "@/assets/svgs";

export type SidebarData = {
  [key: string]: {
    label: string;
    items: {
      label: string;
      url: string;
      icon: React.FC<IconProps>;
      countType?: "notification" | "chat";
    }[];
  };
};

export type SidebarSection = SidebarData[keyof SidebarData];
