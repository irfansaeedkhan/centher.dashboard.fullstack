import {
  Feed,
  Chat,
  CreateCollection,
  Explore,
  Notification,
  Launchpad,
  Staking,
  CreateNFT,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { SidebarData } from "./shared";

export const sidebarData: SidebarData = {
  // social_network: {
  //   label: "SOCIAL NETWORK",
  //   items: [
  //     {
  //       label: "Feed",
  //       url: AppRoutes.feed.index,
  //       icon: Feed,
  //       activeList: [AppRoutes.feed.index, AppRoutes.feed.single_post],
  //     },
  //     {
  //       label: "Notifications",
  //       url: AppRoutes.notifications,
  //       icon: Notification,
  //       countType: "notifications",
  //       activeList: [AppRoutes.notifications],
  //     },
  //     {
  //       label: "Chat",
  //       url: AppRoutes.chat.index,
  //       icon: Chat,
  //       countType: "chats",
  //       activeList: [AppRoutes.chat.index, AppRoutes.chat.single_chat],
  //     },
  //   ],
  // },
  nft_marketplace: {
    label: "NFT MARKETPLACE",
    items: [
      {
        label: "Explore",
        url: AppRoutes.marketplace.explore,
        icon: Explore,
        available_for: "all",
        activeList: [
          AppRoutes.marketplace.explore,
          AppRoutes.marketplace.nfts,
          AppRoutes.marketplace.collections,
          AppRoutes.marketplace.collection,
          AppRoutes.marketplace.nft,
        ],
      },
      {
        label: "Staking",
        url: AppRoutes.staking.index,
        icon: Launchpad,
        activeList: [
          AppRoutes.staking.index,
          AppRoutes.staking.create_staking,
          AppRoutes.staking.staking_details.index,
          AppRoutes.staking.staking_details.rewards,
          AppRoutes.staking.staking_details.referrals,
        ],
        available_for: "all",
        badge: "citizen",
      },
      {
        label: "Create Collection",
        url: AppRoutes.marketplace.create_collection,
        icon: CreateCollection,
        activeList: [AppRoutes.marketplace.create_collection],
        available_for: "citizen",
        badge: "citizen",
      },
      {
        label: "Create NFT",
        url: AppRoutes.marketplace.create_nft,
        icon: CreateNFT,
        activeList: [AppRoutes.marketplace.create_nft],
        available_for: "citizen",
        badge: "citizen",
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
        available_for: "all",
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
  // sidebarData.social_network,
  sidebarData.nft_marketplace,
  sidebarData.dao_government,
];
