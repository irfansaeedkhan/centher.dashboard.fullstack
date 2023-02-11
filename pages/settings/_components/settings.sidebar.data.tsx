import { AppRoutes } from "@/constants/app.routes";
import React from "react";
import { BiLink, BiUser } from "react-icons/bi";
// import { CgLock } from "react-icons/cg";

export const SettingsSidebarData: SettingsSidebarItem[] = [
  {
    label: "Profile",
    icon: <BiUser />,
    link: AppRoutes.settings.profile,
  },
  {
    label: "Social Links",
    icon: <BiLink />,
    link: AppRoutes.settings.social_links,
  },
  // {
  //   label: "Privacy",
  //   icon: <CgLock />,
  //   link: AppRoutes.settings.privacy,
  // },
];

type SettingsSidebarItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};
