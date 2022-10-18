// App imports
import {
  NetworkRewards,
  StakingPack,
  InfluencerDetails,
  InfluencerRequest,
  Users,
  Transactions,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

export const AdminSideBarData = {
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Staking Pack",
        url: AppRoutes.admin.staking_packs,
        icon: StakingPack,
      },
      {
        label: "Network Rewards",
        url: AppRoutes.admin.network_rewards,
        icon: NetworkRewards,
      },
    ],
  },
  influencer: {
    label: "INFLUENCER",
    items: [
      {
        label: "Influencer Request",
        url: AppRoutes.admin.influencer_requests,
        icon: InfluencerRequest,
      },
      {
        label: "Influencer Details",
        url: AppRoutes.admin.influencer_details,
        icon: InfluencerDetails,
      },
      {
        label: "Transactions",
        url: AppRoutes.admin.transactions,
        icon: Transactions,
      },
      {
        label: "Users",
        url: AppRoutes.admin.users,
        icon: Users,
      },
    ],
  },
};

export const AdminSidebarSections = [
  AdminSideBarData.decentralized_finance,
  AdminSideBarData.influencer,
];

export type AdminSideBarData = typeof AdminSideBarData;
export type AdminSideBarType = typeof AdminSideBarData[keyof AdminSideBarData];
