// App imports
import {
  Feed,
  Chat,
  CreateCollection,
  Explore,
  Notification,
  Launchpad,
  // ProfitsDashboard,
  // VotingChain,
  // Multilevel,
  NetworkGenealogy,
  // LiquidityPoolSvg,
  NetworkRewards,
  // StakingContract,
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
        label: "Notifications",
        url: AppRoutes.notifications,
        icon: Notification,
        countType: "notifications",
      },
      {
        label: "Chat",
        url: AppRoutes.chat,
        icon: Chat,
        countType: "chats",
      },
    ],
  },
  nft_marketplace: {
    label: "NFT MARKETPLACE",
    items: [
      {
        label: "Explore",
        url: AppRoutes.marketplace.explore,
        icon: Explore,
      },
      {
        label: "Create Collection",
        url: AppRoutes.marketplace.create_collection,
        icon: CreateCollection,
      },
    ],
  },
  // decentralized_finance: {
  //   label: "DECENTRALIZED FINANCE",
  //   items: [
  //     {
  //       label: "Liquidity Pool",
  //       url: AppRoutes.liquidity_pool,
  //       icon: LiquidityPoolSvg,
  //     },
  //     {
  //       label: "Staking Contract",
  //       url: AppRoutes.staking_packs,
  //       icon: StakingContract,
  //     },
  //   ],
  // },
  referral_program: {
    label: "REFERRAL PROGRAM",
    items: [
      {
        label: "Network Rewards",
        url: AppRoutes.referral.overview,
        icon: NetworkRewards,
      },
      {
        label: "Network Genealogy",
        url: AppRoutes.referral.network_genealogy,
        icon: NetworkGenealogy,
      },
    ],
  },
  dao_government: {
    label: "DAO GOVERNMENT",
    items: [
      {
        label: "Launchpad",
        label2: "Buy Centher",
        url: AppRoutes.buy_centher,
        icon: Launchpad,
      },
      // {
      //   label: "Profits Dashboard",
      //   url: AppRoutes.profits_dashboard,
      //   icon: ProfitsDashboard,
      // },
      // {
      //   label: "Voting Chain",
      //   url: AppRoutes.voting_chain,
      //   icon: VotingChain,
      // },
    ],
  },
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  // sidebarData.decentralized_finance,
  sidebarData.referral_program,
  sidebarData.dao_government,
];
