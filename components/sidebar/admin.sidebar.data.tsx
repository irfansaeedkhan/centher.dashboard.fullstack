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
        activeList: [AppRoutes.liquidity_pool],
      },
      {
        label: "Staking Pack",
        url: AppRoutes.admin.staking_packs,
        icon: StakingContract,
        activeList: [AppRoutes.staking_packs],
      },
      {
        label: "Network Rewards",
        url: AppRoutes.admin.network_rewards,
        icon: NetworkRewards,
        activeList: [AppRoutes.admin.network_rewards],
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
        activeList: [AppRoutes.admin.influencer_requests],
      },
      {
        label: "Influencer Details",
        url: AppRoutes.admin.influencer_details,
        icon: InfluencerDetails,
        activeList: [AppRoutes.admin.influencer_details],
      },
      {
        label: "Transactions",
        url: AppRoutes.admin.transactions,
        icon: Transactions,
        activeList: [AppRoutes.admin.transactions],
      },
      {
        label: "Users",
        url: AppRoutes.admin.users,
        icon: Users,
        activeList: [AppRoutes.admin.users],
      },
    ],
  },
};

export const AdminSidebarSections = [
  adminSideBarData.decentralized_finance,
  adminSideBarData.influencer,
];
