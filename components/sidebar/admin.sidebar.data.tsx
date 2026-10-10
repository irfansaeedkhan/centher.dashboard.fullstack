import {
  NetworkRewards,
  Users,
  StakingContract,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { SidebarData } from "./shared";

export const adminSideBarData: SidebarData = {
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Staking Pack",
        url: AppRoutes.admin.staking_packs,
        icon: StakingContract,
        activeList: [AppRoutes.staking_packs],
        available_for: "all",
      },
      {
        label: "Network Rewards",
        url: AppRoutes.admin.network_rewards,
        icon: NetworkRewards,
        activeList: [AppRoutes.admin.network_rewards],
        available_for: "all",
      },
    ],
  },
  influencer: {
    label: "USERS",
    items: [
      {
        label: "Users",
        url: AppRoutes.admin.users,
        icon: Users,
        activeList: [AppRoutes.admin.users],
        available_for: "all",
      },
    ],
  },
};

export const AdminSidebarSections = [
  adminSideBarData.decentralized_finance,
  adminSideBarData.influencer,
];
