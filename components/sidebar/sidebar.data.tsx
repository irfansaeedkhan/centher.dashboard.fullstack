// App imports
import {
  Feed,
  Chat,
  CreateCollection,
  DaoGovernment,
  Explore,
  Notification,
  ProfitsDashboard,
  VotingChain,
  Multilevel,
  NetworkGenealogy,
  LiquidityPoolSvg,
  NetworkRewards,
  StakingContract,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

import { SidebarData } from "./shared";

export const sidebarData: SidebarData = {
  social_network: {
    label: "SOCIAL NETWORK",
    items: [
      {
        label: "Feed",
        url: AppRoutes.feed.index,
        icon: Feed,
      },
      {
        label: "Chat",
        url: AppRoutes.chat,
        icon: Chat,
        countType: "chats",
      },
      {
        label: "Notifications",
        url: AppRoutes.notifications,
        icon: Notification,
        countType: "notifications",
      },
    ],
  },
  nft_marketplace: {
    label: "NFT MARKETPLACE",
    items: [
      {
        label: "Explore",
        url: AppRoutes.explore,
        icon: Explore,
      },
      {
        label: "Create Collection",
        url: AppRoutes.nfts.create_collection,
        icon: CreateCollection,
      },
    ],
  },
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Liquidity Pool",
        url: AppRoutes.liquidity_pool,
        icon: LiquidityPoolSvg,
      },
      {
        label: "Staking Contract",
        url: AppRoutes.staking_packs,
        icon: StakingContract,
      },
      {
        label: "Network Rewards",
        url: AppRoutes.network_rewards,
        icon: NetworkRewards,
      },
    ],
  },
  referral_program: {
    label: "REFERRAL PROGRAM",
    items: [
      {
        label: "Multilevel License",
        url: AppRoutes.referral_program,
        icon: Multilevel,
      },
      {
        label: "Network Genealogy",
        url: AppRoutes.referral_program,
        icon: NetworkGenealogy,
      },
    ],
  },
  dao_government: {
    label: "DAO GOVERNMENT",
    items: [
      {
        label: "Buy NTR DAO",
        url: AppRoutes.buy_ntr_dao,
        icon: DaoGovernment,
      },
      {
        label: "Profits Dashboard",
        url: AppRoutes.profits_dashboard,
        icon: ProfitsDashboard,
      },
      {
        label: "Voting Chain",
        url: AppRoutes.voting_chain,
        icon: VotingChain,
      },
    ],
  },
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.decentralized_finance,
  sidebarData.referral_program,
  sidebarData.dao_government,
];
