import { AppRoutes } from "@/constants/app.routes";

export const SettingsSidebarData: SettingsSidebarItem[] = [
  {
    label: "Profile",
    link: AppRoutes.settings.profile,
    available_for: "all",
  },
  {
    label: "About Me",
    link: AppRoutes.settings.about,
    available_for: "all",
  },
  {
    label: "Social Links",
    link: AppRoutes.settings.social_links,
    available_for: "all",
  },
  {
    label: "Team Members",
    link: AppRoutes.settings.citizen.team_members,
    available_for: "citizen",
  },
  {
    label: "Team",
    link: AppRoutes.settings.team,
    available_for: "non-citizen",
  },
  {
    label: "Privacy",
    link: AppRoutes.settings.privacy,
    available_for: "all",
  },
];

type SettingsSidebarItem = {
  label: string;
  link: string;
  available_for: "citizen" | "verified" | "all" | "non-citizen";
};
