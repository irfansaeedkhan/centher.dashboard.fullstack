import React from "react";
import { FiInstagram, FiYoutube } from "react-icons/fi";
import Image from "next/image";
import { SiBinance } from "react-icons/si";
import useUser from "@/hooks/use.user";
import { usePreBookingStats } from "@/hooks/use-pre-booking-stats";
import {
  LinkNewIcon,
  NewTelegramIcon,
  CentherIcon,
  Whitepaper,
  XLogo,
} from "@/assets/svgs";
import TeamMembers from "./team-members";

const DetailsProject = () => {
  const { user } = useUser();
  const { loading, preBookingStats } = usePreBookingStats(user?._id);

  if (loading === "failed") {
    return (
      <div className="text-center font-medium text-red-400">
        Failed to load data!
      </div>
    );
  }

  if (loading === "loading" || loading === "idle") {
    return (
      <div className="mt-5 flex w-full items-center justify-center">
        <Image
          src="/images/preloader.png"
          alt="Preloader"
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 object-cover"
        />
      </div>
    );
  }

  if (!preBookingStats) return null;

  return (
    <div className="flex h-auto w-full flex-col gap-6 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4 fsm:p-6 flg:p-8 fxl:p-10">
      <div className="text-base font-semibold text-white fmd:text-xl">
        About {preBookingStats.receivable_token_name}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Official Links</div>
          <div className="flex items-center gap-2">
            <a
              href="https://dexagon.io/"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <LinkNewIcon className="group-hover:[&>*]:stroke-white" />
              <span>Website</span>
            </a>
            <a
              href="https://dexagon.io/wp-content/uploads/2023/04/Dexagon-White-Paper-1.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <Whitepaper className="group-hover:[&>*]:stroke-white" />
              <span>Whitepaper</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Social Links</div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://twitter.com/officialdexagon"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <XLogo className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>X.com</span>
            </a>
            <a
              href="https://youtube.com/@officialdexagon"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <FiYoutube className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>YouTube</span>
            </a>
            <a
              href="https://instagram.com/dexagonofficial"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <FiInstagram className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Instagram</span>
            </a>
            <a
              href="https://t.me/officialdexagon"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <NewTelegramIcon className="group-hover:[&>*]:stroke-white" />
              <span>Telegram</span>
            </a>
            <a
              href="https://app.centher.io/profile/0xa638d0182d075278a9ea6480c1430c6e7fb490c9"
              target="_blank"
              rel="noreferrer noopener"
              className="centher-social-button flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14"
            >
              <span className="h-5 w-5 flex-shrink-0">
                <CentherIcon />
              </span>
              <span>Centher</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Explorers</div>
          <div className="flex items-center gap-2">
            <a
              href="https://bscscan.com/address/0xEcb4c542DE0d7AF3aA294c5c4Ae0BefE8E93bD9c"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <SiBinance className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>BscScan</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Category</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className={button}>
              <span>Metaverse</span>
            </div>
            <div className={button}>
              <span>Real Estate</span>
            </div>
            <div className={button}>
              <span>Decentralized Finance</span>
            </div>
            <div className={button}>
              <span>Artificial Intelligence</span>
            </div>
          </div>
        </div>
        <div className="mb-2 mt-3  flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Team</div>
          <TeamMembers />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-white">Description</div>
        <p className="whitespace-pre-wrap text-xs font-medium text-gray-shade-14 md:text-sm">
          At Dexagon we want to open the gates to the Virtual Life on the
          metaverse, revealing a new way of approaching the virtual world.
          It&apos;s a new approach that involves all the senses, bringing you in
          a complete different experience: the immersiverse. Dexagon is a
          massive interoperable metaverse project based on custom hardware
          technology (Diogene VR visor and ring) and utility token to use inside
          multiple metaverse platforms. The metaverse of Dexagon is all based on
          decentralization, where DeFi and real estate operations are possible!
        </p>
      </div>
    </div>
  );
};

export default DetailsProject;

const button = `group flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 stroke-gray-shade-14 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14 hover:text-white`;
const centher_button = `group flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14 hover:text-white`;
