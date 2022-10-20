// App imports
import {
  Feed,
  Chat,
  CreateCollection,
  DaoGovernment,
  Explore,
  Logout,
  NetworkRewards,
  Notification,
  ProfitsDashboard,
  ReferralProgram,
  StakingPack,
  TopInfluencer,
  VotingChain,
  Multilevel,
  NetworkGenealogy,
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
        countType: "chat",
      },
      {
        label: "Notifications",
        url: AppRoutes.notifications,
        icon: Notification,
        countType: "notification",
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
        label: "Top Influencers",
        url: AppRoutes.top_influencers,
        icon: TopInfluencer,
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
        label: "Staking Pack",
        url: AppRoutes.staking_packs,
        icon: StakingPack,
      },
      {
        label: "Network Rewards",
        url: AppRoutes.network_rewards,
        icon: NetworkRewards,
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
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.decentralized_finance,
  sidebarData.dao_government,
  sidebarData.referral_program,
];
