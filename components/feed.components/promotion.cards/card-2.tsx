import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-[272px] flex-col items-center justify-end rounded-10px bg-[url(/images/ad-g.png)] bg-cover bg-center bg-no-repeat px-4 py-6`,
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center">
        <p
          className={`text-center text-sm font-bold uppercase leading-[17.07px] text-white`}
        >
          Last round of presale is almost over! Come get your DXC here.
        </p>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: AddressFactory.getContractAddress(
                SmartContractName.DXC
              ),
              round: 3,
            },
          }}
        >
          <Button
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
