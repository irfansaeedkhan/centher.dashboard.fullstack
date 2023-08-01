import React from "react";
import { BiLink, BiUser } from "react-icons/bi";
import { TbInfoSquare } from "react-icons/tb";
import { CgLock } from "react-icons/cg";
import { AppRoutes } from "@/constants/app.routes";

export const SettingsSidebarData: SettingsSidebarItem[] = [
  {
    label: "Profile",
    link: AppRoutes.settings.profile,
  },
  {
    label: "About Me",
    link: AppRoutes.settings.about,
  },
  {
    label: "Social Links",
    link: AppRoutes.settings.social_links,
  },
  {
    label: "Privacy",
    link: AppRoutes.settings.privacy,
  },
];

type SettingsSidebarItem = {
  label: string;
  link: string;
};
