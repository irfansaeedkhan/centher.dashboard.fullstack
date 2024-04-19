import { Explore, Launchpad, Staking } from "@/assets/svgs";
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
          AppRoutes.marketplace.collections,
          AppRoutes.marketplace.collection,
          AppRoutes.marketplace.nft,
        ],
      },
      {
        label: "Staking",
        url: AppRoutes.staking.index,
        icon: Staking,
        activeList: [
          AppRoutes.staking.index,
          AppRoutes.staking.faqs,
          AppRoutes.staking.create_staking,
          AppRoutes.staking.staking_details.index,
          AppRoutes.staking.staking_details.referrals,
          AppRoutes.staking.staking_details.project_details,
        ],
        available_for: "all",
        badge: "citizen",
      },
      {
        label: "Launchpad List",
        url: "/launchpad/launchpad-list/?list_type=all",
        icon: Launchpad,
        available_for: "all",
        activeList: [
          AppRoutes.launchpad.launchpad_list.index,
          AppRoutes.launchpad.launchpad_list.launchpad_list_details,
        ],
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
