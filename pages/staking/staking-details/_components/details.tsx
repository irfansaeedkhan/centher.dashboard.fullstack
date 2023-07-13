import React from "react";
import { FiInstagram, FiTwitter } from "react-icons/fi";
import { RiFacebookCircleLine } from "react-icons/ri";
import { SiBinance } from "react-icons/si";

import {
  LinkNewIcon,
  NewCentherIcon,
  NewTelegramIcon,
  Whitepaper,
} from "@/assets/svgs";
import TeamMembers from "@/pages/launchpad/pre-booking/_components/team-members";

const Details = () => {
  return (
    <div className="flex flex-col gap-6 border-b border-gray-shade-3 pb-8">
      <p className="text-xl font-semibold text-white">About DeXa Pack 1</p>
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
              <FiTwitter className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Twitter</span>
            </a>
            <a
              href="https://youtube.com/@officialdexagon"
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <RiFacebookCircleLine className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Facebook</span>
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
              <NewCentherIcon />
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
        <div className="mt-3 mb-2  flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Team</div>
          <TeamMembers />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-white">Description</div>
        <p className="whitespace-pre-wrap text-xs font-medium text-gray-shade-14 md:text-sm">
          At Dexagon we want to open the gates to the Virtual Life on the
          metaverse, revealing a new way of approaching the virtual world.{" "}
          <br />
          It&apos;s a new approach that involves all the senses, bringing you in
          a complete different experience: the immersiverse.
          <br />
          Dexagon is a massive interoperable metaverse project based on custom
          hardware technology (Diogene VR visor and ring) and utility token to
          use inside multiple metaverse platforms. <br />
          The metaverse of Dexagon is all based on decentralization, where DeFi
          and real estate operations are possible!
        </p>
      </div>
    </div>
  );
};

export default Details;

const button = `group flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 stroke-gray-shade-14 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14 hover:text-white cursor-pointer`;
