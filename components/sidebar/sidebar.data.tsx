import { CreateCollection, Explore, Launchpad, CreateNFT } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { SidebarData } from "./shared";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

export const sidebarData: SidebarData = {
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
        url: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        icon: Launchpad,
        available_for: "all",
        activeList: [AppRoutes.launchpad],
      },
    ],
  },
};

export const SidebarSections = [
  sidebarData.nft_marketplace,
  sidebarData.dao_government,
];
