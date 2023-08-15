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
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { OptionalType } from "@/staking/types";

const Details: React.FC<{ data: OptionalType<ListCardDataOBj> }> = ({
  data,
}) => {
  const findLink = (name: string) => {
    try {
      const result = data?.metadata.socialMedias.find(
        (e: any) => e.name == name
      )?.link;

      if (result) {
        return result;
      } else throw new Error();
    } catch (error) {
      return "/#";
    }
  };

  return (
    <div className="flex flex-col gap-6 border-b border-gray-shade-3 pb-8">
      <p className="text-xl font-semibold text-white">{data?.pack}</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Official Links</div>
          <div className="flex items-center gap-2">
            <a
              href={findLink("website_url")}
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <LinkNewIcon className="group-hover:[&>*]:stroke-white" />
              <span>Website</span>
            </a>
            <a
              href={findLink("whitepaper")}
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
              href={findLink("twitter")}
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <FiTwitter className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Twitter</span>
            </a>
            <a
              href={findLink("facebook")}
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <RiFacebookCircleLine className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Facebook</span>
            </a>
            <a
              href={findLink("instagram")}
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <FiInstagram className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              <span>Instagram</span>
            </a>
            <a
              href={findLink("telegram")}
              target="_blank"
              rel="noreferrer noopener"
              className={button}
            >
              <NewTelegramIcon className="group-hover:[&>*]:stroke-white" />
              <span>Telegram</span>
            </a>
            <a
              href={findLink("centher")}
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
              href={findLink("explorers")}
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
            {data?.metadata?.categories?.length ? (
              data?.metadata.categories.map((e: any, i: number) => (
                <div className={button} key={i}>
                  <a
                    href={e.value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={button}
                  >
                    <span>{e.label}</span>
                  </a>
                </div>
              ))
            ) : (
              <p className="whitespace-pre-wrap text-xs font-medium text-gray-shade-14 md:text-sm">
                No Category
              </p>
            )}
          </div>
        </div>
        {data?.metadata?.team?.length ? (
          <div className="mt-3 mb-2  flex flex-col gap-3">
            <div className="text-sm font-semibold text-white">Team</div>
            <TeamMembers data={data?.metadata?.team} />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-white">Description</div>
        <p className="whitespace-pre-wrap text-xs font-medium text-gray-shade-14 md:text-sm">
          {data?.metadata?.description
            ? data?.metadata?.description
            : "No Description"}
        </p>
      </div>
    </div>
  );
};

export default Details;

const button = `group flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 stroke-gray-shade-14 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14 hover:text-white cursor-pointer`;
