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
        url: AppRoutes.chat.index,
        icon: Chat,
        countType: "chats",
        activeList: [AppRoutes.chat.index, AppRoutes.chat.single_chat],
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
  dao_government: {
    label: "DAO GOVERNMENT",
    items: [
      {
        label: "Launchpad",
        url: AppRoutes.launchpad_pre_booking.index,
        icon: Launchpad,
        activeList: [
          AppRoutes.launchpad_pre_booking.index,
          AppRoutes.launchpad,
          AppRoutes.launchpad_pre_booking.booking,
        ],
      },
    ],
  },
};

export const SidebarSections = [
  sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.dao_government,
];
