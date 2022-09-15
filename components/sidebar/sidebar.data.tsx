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
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

export const SidebarData = {
  social_network: {
    label: "SOCIAL NETWORK",
    items: [
      {
        label: "Feed",
        url: AppRoutes.feed,
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
        url: AppRoutes.home,
        icon: Explore,
      },
      {
        label: "Top Influencers",
        url: AppRoutes.top_influencers,
        icon: TopInfluencer,
      },
      {
        label: "Create Collection",
        url: AppRoutes.create_collection,
        icon: CreateCollection,
      },
    ],
  },
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Staking Pack",
        url: AppRoutes.staking_pack,
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
        icon: ReferralProgram,
      },
      {
        label: "Network Genealogy",
        url: AppRoutes.referral_program,
        icon: ReferralProgram,
      },
    ],
  },
  logout: {
    label: "WILL YOU GET OUT?",
    items: [
      {
        label: "Logout",
        url: "/logout",
        icon: Logout,
      },
    ],
  },
};

export const SidebarSections = [
  SidebarData.social_network,
  SidebarData.nft_marketplace,
  SidebarData.decentralized_finance,
  SidebarData.dao_government,
  SidebarData.referral_program,
  SidebarData.logout,
];

export type SidebarData = typeof SidebarData;
export type SidebarSection = typeof SidebarData[keyof SidebarData];
