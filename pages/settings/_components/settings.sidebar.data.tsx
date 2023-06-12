import React from "react";
import { BiLink, BiUser } from "react-icons/bi";
import { TbInfoSquare } from "react-icons/tb";
import { CgLock } from "react-icons/cg";

import { AppRoutes } from "@/constants/app.routes";

export const SettingsSidebarData: SettingsSidebarItem[] = [
  {
    label: "Profile",
    icon: <BiUser />,
    link: AppRoutes.settings.profile,
  },
  {
    label: "About Me",
    icon: <TbInfoSquare />,
    link: AppRoutes.settings.about,
  },
  {
    label: "Social Links",
    icon: <BiLink />,
    link: AppRoutes.settings.social_links,
  },
  {
    label: "Privacy",
    icon: <CgLock />,
    link: AppRoutes.settings.privacy,
  },
];

type SettingsSidebarItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};
