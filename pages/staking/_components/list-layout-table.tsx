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
            <TableCell element={"th"}>Token Name</TableCell>
            <TableCell element={"th"}>Adress</TableCell>
            <TableCell element={"th"}>Apy</TableCell>
            <TableCell element={"th"}>Symbol</TableCell>
          </tr>
        </thead>
        <tbody className="">
          {card.map((item, index) => (
            <TableRow key={index}>
              <TableCell element={"td"} className="flex items-center gap-2">
                <Image
                  src={
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, item.token_address)
                    )?.logo?.length
                      ? (coins.find((e) =>
                          eqAddress(e?.contractAddress, item.token_address)
                        )?.logo as string)
                      : "/images/profile-header-cover.jpg"
                  }
                  alt="image"
                  width={40}
                  height={40}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-white">
                  {
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, item.token_address)
                    )?.name
                  }
                </span>
              </TableCell>
              <TableCell element={"td"}>
                {sliceAccountAddress(item.token_address)}
              </TableCell>
              <TableCell element={"td"}>{item.apy}</TableCell>
              <TableCell element={"td"}>
                {
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, item.token_address)
                  )?.symbol
                }
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListLayoutTable;
