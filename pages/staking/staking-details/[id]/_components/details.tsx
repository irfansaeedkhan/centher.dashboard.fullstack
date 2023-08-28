import React, { useEffect, useState } from "react";
import { FiInstagram, FiTwitter } from "react-icons/fi";
import { RiFacebookCircleLine } from "react-icons/ri";
import { SiBinance } from "react-icons/si";

import {
  LinkNewIcon,
  NewCentherIcon,
  NewTelegramIcon,
  Whitepaper,
} from "@/assets/svgs";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { OptionalType } from "@/staking/types";
import { Memb } from "@/pages/staking/create-staking/_components/staking-review-modal";
import { fetchUsers } from "@/hooks/user.get.multi.users";
import { eqAddress } from "@/live/utils/address.utils";
import TeamMembers from "@/pages/staking/create-staking/_components/team.memeber";
import { ZeroAddress } from "@/web3/constants/common";
import { isAddress } from "ethers/lib/utils";

const Details: React.FC<{ data: OptionalType<ListCardDataOBj> }> = ({
  data,
}) => {
  const [users, setUsers] = useState<Memb[]>([]);
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

  useEffect(() => {
    const getUsers = async (walletAddresses: string[]) => {
      const filteredUsers = walletAddresses.filter(
        (e) => ZeroAddress != e && isAddress(e)
      );

      if (!filteredUsers?.length) {
        return [];
      }

      const users = await fetchUsers(walletAddresses);
      return users;
    };

    if (data && !users?.length) {
      const addresses = data?.metadata?.team.map((e: any) => e.walletAddress);
      if (addresses?.length) {
        getUsers(addresses).then((users) => {
          const mappedUsers = users.map((e) => {
            return {
              userImage: e.profile_image,
              userDisplayName: e.display_name,
              title: data?.metadata?.team.find((e: any) =>
                eqAddress(e.walletAddress, e._id)
              )?.jobTitle,
              address: e._id,
            };
          });

          setUsers(mappedUsers);
        });
      }
    }
  }, [data?.metadata]);

  return (
    <div className="flex flex-col gap-6 border-b border-gray-shade-3 pb-8">
      <p className="text-xl font-semibold text-white">{data?.pack}</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Official Links</div>
          <div className="flex items-center gap-2">
            {findLink("website_url") != "/#" ? (
              <a
                href={findLink("website_url")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <LinkNewIcon className="group-hover:[&>*]:stroke-white" />
                <span>Website</span>
              </a>
            ) : null}
            {findLink("whitepaper") != "/#" ? (
              <a
                href={findLink("whitepaper")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <Whitepaper className="group-hover:[&>*]:stroke-white" />
                <span>Whitepaper</span>
              </a>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white">Social Links</div>
          <div className="flex flex-wrap items-center gap-2">
            {findLink("twitter") != "/#" ? (
              <a
                href={findLink("twitter")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <FiTwitter className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                <span>X.com</span>
              </a>
            ) : null}
            {findLink("facebook") != "/#" ? (
              <a
                href={findLink("facebook")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <RiFacebookCircleLine className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                <span>Facebook</span>
              </a>
            ) : null}
            {findLink("instagram") != "/#" ? (
              <a
                href={findLink("instagram")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <FiInstagram className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                <span>Instagram</span>
              </a>
            ) : null}
            {findLink("telegram") != "/#" ? (
              <a
                href={findLink("telegram")}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                <NewTelegramIcon className="group-hover:[&>*]:stroke-white" />
                <span>Telegram</span>
              </a>
            ) : null}
            {findLink("centher") != "/#" ? (
              <a
                href={findLink("centher")}
                target="_blank"
                rel="noreferrer noopener"
                className="centher-social-button flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14"
              >
                <NewCentherIcon />
                <span>Centher</span>
              </a>
            ) : null}
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
        {users && users.length > 0 ? (
          <div className="mb-2 mt-3  flex flex-col gap-3">
            <div className="text-sm font-semibold text-white">Team</div>
            <TeamMembers teamMemberList={users} />
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
