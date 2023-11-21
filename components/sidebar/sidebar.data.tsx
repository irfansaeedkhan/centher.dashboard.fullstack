import { Explore, Launchpad } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { CreateLaunchpad } from "@/assets/svgs/launchpad-v2";
import { SidebarData } from "./shared";

export const sidebarData: SidebarData = {
  nft_marketplace: {
    label: "Explore",
    items: [
      {
        label: "NFT Marketplace",
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
        label: "Launchpad",
        url: `/launchpad/${AddressFactory.getContractAddress(
          SmartContractName.DXC
        )}/3`,
        icon: Launchpad,
        available_for: "all",
        activeList: [AppRoutes.launchpad.index],
      },
      {
        label: "Create Launchpad",
        url: AppRoutes.launchpad.create_launchpad,
        icon: CreateLaunchpad,
        available_for: "all",
        activeList: [AppRoutes.launchpad.create_launchpad],
      },
    ],
  },
};

export const SidebarSections = [sidebarData.nft_marketplace];
