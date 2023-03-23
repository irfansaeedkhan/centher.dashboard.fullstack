// App imports
import {
  Feed,
  Chat,
  CreateCollection,
  Explore,
  Notification,
  Launchpad,
  NetworkGenealogy,
  NetworkRewards,
  CreateNFT,
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
        activeList: [AppRoutes.feed.index, AppRoutes.feed.single_post],
      },
      {
        label: "Notifications",
        url: AppRoutes.notifications,
        icon: Notification,
        countType: "notifications",
        activeList: [AppRoutes.notifications],
      },
      {
        label: "Chat",
        url: AppRoutes.chat,
        icon: Chat,
        countType: "chats",
        activeList: [AppRoutes.chat],
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
        activeList: [
          AppRoutes.marketplace.explore,
          AppRoutes.marketplace.nfts,
          AppRoutes.marketplace.collections,
          AppRoutes.marketplace.collection,
          AppRoutes.marketplace.nft,
        ],
      },
      {
        label: "Create Collection",
        url: AppRoutes.marketplace.create_collection,
        icon: CreateCollection,
        activeList: [AppRoutes.marketplace.create_collection],
      },
      {
        label: "Create NFT",
        url: AppRoutes.marketplace.create_nft,
        icon: CreateNFT,
        activeList: [AppRoutes.marketplace.create_nft],
      },
    ],
  },
  referral_program: {
    label: "REFERRAL PROGRAM",
    items: [
      {
        label: "Network Rewards",
        url: AppRoutes.referral.overview,
        icon: NetworkRewards,
        activeList: [
          AppRoutes.referral.overview,
          AppRoutes.referral.network_rewards,
        ],
      },
      {
        label: "Network Genealogy",
        url: AppRoutes.referral.network_genealogy,
        icon: NetworkGenealogy,
        activeList: [AppRoutes.referral.network_genealogy],
      },
    ],
  },
  dao_government: {
    label: "DAO GOVERNMENT",
    items: [
      {
        label: "Launchpad",
        url: "/launchpad/dexa/0",
        icon: Launchpad,
        activeList: [AppRoutes.launchpad],
      },
    ],
  },
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.referral_program,
  sidebarData.dao_government,
];
