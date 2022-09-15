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
} from "@/assets.svg/svg";

export const SidebarData = {
  social_network: {
    label: "SOCIAL NETWORK",
    items: [
      {
        label: "Feed",
        url: "/feed",
        icon: Feed,
      },
      {
        label: "Chat",
        url: "/chat",
        icon: Chat,
        countType: "chats",
      },
      {
        label: "Notifications",
        url: "/notifications",
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
        url: "/",
        icon: Explore,
      },
      {
        label: "Top Influencers",
        url: "/top-influencer",
        icon: TopInfluencer,
      },
      {
        label: "Create Collection",
        url: "/create-collection",
        icon: CreateCollection,
      },
    ],
  },
  decentralized_finance: {
    label: "DECENTRALIZED FINANCE",
    items: [
      {
        label: "Staking Pack",
        url: "/staking-pack",
        icon: StakingPack,
      },
      {
        label: "Network Rewards",
        url: "/network-rewards",
        icon: NetworkRewards,
      },
    ],
  },
  dao_government: {
    label: "DAO GOVERNMENT",
    items: [
      {
        label: "Buy NTRDAO",
        url: "/buy-ntrdao",
        icon: DaoGovernment,
      },
      {
        label: "Profits Dashboard",
        url: "/profits-dashboard",
        icon: ProfitsDashboard,
      },
      {
        label: "Voting Chain",
        url: "/voting-chain",
        icon: VotingChain,
      },
    ],
  },
  referral_program: {
    label: "REFERRAL PROGRAM",
    items: [
      {
        label: "Multilevel License",
        url: "/referral-program",
        icon: ReferralProgram,
      },
      {
        label: "Network Genealogy",
        url: "/referral-program",
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

export const SectionName = [
  SidebarData.social_network,
  SidebarData.nft_marketplace,
  SidebarData.decentralized_finance,
  SidebarData.dao_government,
  SidebarData.referral_program,
  SidebarData.logout,
];
