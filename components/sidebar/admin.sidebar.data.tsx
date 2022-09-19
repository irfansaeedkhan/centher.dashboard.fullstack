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
        url: AppRoutes.admin_staking_pack,
        icon: StakingPack,
      },
      {
        label: "Network Rewards",
        url: AppRoutes.admin_network_rewards,
        icon: NetworkRewards,
      },
    ],
  },
  influencer: {
    label: "INFLUENCER",
    items: [
      {
        label: "Influencer Request",
        url: AppRoutes.admin_influencer_request,
        icon: InfluencerRequest,
      },
      {
        label: "Influencer Details",
        url: AppRoutes.admin_influencer_details,
        icon: InfluencerDetails,
      },
      {
        label: "Transactions",
        url: AppRoutes.admin_transactions,
        icon: Transactions,
      },
      {
        label: "Users",
        url: AppRoutes.admin_users,
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
