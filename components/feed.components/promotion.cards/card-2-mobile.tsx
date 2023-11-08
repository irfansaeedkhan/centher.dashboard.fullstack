import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import Button from "@/components/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/ad-g.png)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div>
        <p
          className={`text-center text-sm font-medium uppercase leading-[17.07px] text-white`}
        >
          Last round of presale is almost over! Come get your DXC here.
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.launchpad.index,
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
  );
};
