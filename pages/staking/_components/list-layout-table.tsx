import React from "react";
import { ListCardDataOBj } from "./list-card-data";
import {
  TableCell,
  TableRow,
} from "../staking-details/[id]/_components/table-types";
import Image from "next/image";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { formatEther } from "ethers/lib/utils";
import Link from "next/link";
import { Staking } from "@/assets/svgs";

interface Props {
  card: ListCardDataOBj[];
  coins: Array<CoinDetails | undefined>;
}

const ListLayoutTable: React.FC<Props> = ({ card, coins }) => {
  return (
    <div className="mt-6 h-[500px] w-full overflow-auto rounded-[14px] border border-gray-shade-3 pt-16">
      <table className={`w-full max-w-full table-auto`}>
        <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
          <tr>
            <TableCell element={"th"} className="min-w-[100px]">
              Pool Name
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Apy
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Token
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Total Staked
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Min Stake
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Liquidity Pool
            </TableCell>
            <TableCell element={"th"} className="min-w-[100px]">
              Status
            </TableCell>
          </tr>
        </thead>
        <tbody className="">
          {card.map((item, index) => (
            <TableRow key={index}>
              <TableCell
                element={"td"}
                className="flex min-w-[100px] items-center gap-2"
              >
                <Link href={"/staking/staking-details/" + item.id}>
                  {item?.metadata?.logo ? (
                    <Image
                      src={item.metadata?.logo}
                      alt="image"
                      width={15}
                      height={15}
                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                  )}

                  <span className="text-sm font-semibold text-white">
                    {item.pack}
                  </span>
                </Link>
              </TableCell>

              <TableCell element={"td"} className="min-w-[100px]">
                <Link href={"/staking/staking-details/" + item.id}>
                  {+item.apy / 100} %
                </Link>
              </TableCell>
              <TableCell
                element={"td"}
                className="flex min-w-[100px] items-center gap-2"
              >
                <Link href={"/staking/staking-details/" + item.id}>
                  {coins.find((e) =>
                    eqAddress(e?.contractAddress, item.token_address)
                  )?.logo?.length ? (
                    <Image
                      src={
                        coins.find((e) =>
                          eqAddress(e?.contractAddress, item.token_address)
                        )?.logo as string
                      }
                      alt="image"
                      width={15}
                      height={15}
                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                  )}

                  <span className="text-sm font-semibold text-white">
                    {
                      coins.find((e) =>
                        eqAddress(e?.contractAddress, item.token_address)
                      )?.name
                    }
                  </span>
                </Link>
              </TableCell>
              <TableCell element={"td"} className="min-w-[100px]">
                <Link href={"/staking/staking-details/" + item.id}>
                  {formatEther(item.totalStakedAmount)}{" "}
                  {
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, item.token_address)
                    )?.symbol
                  }
                </Link>
              </TableCell>
              <TableCell element={"td"} className="min-w-[100px]">
                <Link href={"/staking/staking-details/" + item.id}>
                  {formatEther(item.min_staking_amount)}{" "}
                  {
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, item.token_address)
                    )?.symbol
                  }
                </Link>
              </TableCell>
              <TableCell element={"td"} className="min-w-[100px]">
                <Link href={"/staking/staking-details/" + item.id}>
                  {item.liquidity_pool_provided == "yes" ? (
                    <span className="textGradient">Yes</span>
                  ) : (
                    <span className="text-error">No</span>
                  )}
                </Link>
              </TableCell>
              <TableCell element={"td"} className="min-w-[100px]">
                <Link href={"/staking/staking-details/" + item.id}>
                  {item.totalStakedAmount < item.supply ? (
                    <span className="textGradient">Active</span>
                  ) : (
                    <span className="textGradient">Filled</span>
                  )}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListLayoutTable;
