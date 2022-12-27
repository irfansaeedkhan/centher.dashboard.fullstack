// App imports
import {
  NetworkRewards,
  InfluencerDetails,
  InfluencerRequest,
  Users,
  Transactions,
  LiquidityPoolSvg,
  StakingContract,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

import { SidebarData } from "./shared";

export const adminSideBarData: SidebarData = {
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Liquidity Pool",
        url: AppRoutes.liquidity_pool,
        icon: LiquidityPoolSvg,
      },
      {
        label: "Staking Pack",
        url: AppRoutes.admin.staking_packs,
        icon: StakingContract,
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
  adminSideBarData.decentralized_finance,
  adminSideBarData.influencer,
];
