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
      {
        label: "Create NFT",
        label2: "marketplace/create",
        url: AppRoutes.marketplace.create_nft,
        icon: CreateNFT,
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
    ],
  },
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.referral_program,
  sidebarData.dao_government,
];
