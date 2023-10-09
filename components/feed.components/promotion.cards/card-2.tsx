import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[400px] w-[272px] flex-col items-center justify-between rounded-10px bg-background-shade-3 p-6`,
        className
      )}
      {...props}
    >
      <div className={`relative`}>
        <Image
          src="/images/dexagon--launch.png"
          width={150}
          height={150}
          alt="Picture of the author"
          className="h-auto w-auto object-contain"
        />
      </div>
      <div className="flex flex-col items-center">
        <p
          className={`text-center text-sm font-bold uppercase leading-[17.07px] text-white`}
        >
          Dexa token is for sale now! Go get it for the best price before round
          1 ends!
        </p>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: AddressFactory.getContractAddress(
                SmartContractName.DXC
              ),
              round: 1,
            },
          }}
        >
          <FinalButton
            title="Buy DeXa Token"
            variant="primary"
            borderRounded="10px"
            className="mt-4"
          />
        </Link>
      </div>
    </div>
  );
};
