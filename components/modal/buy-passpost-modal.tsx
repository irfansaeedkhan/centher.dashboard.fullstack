import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import clsx from "clsx";

import { useEventListener } from "usehooks-ts";
import { useOnClickOutside } from "usehooks-ts";
import { ModalPortal } from "@/components/modal/modal.portal";
import FinalButton from "../button/final.button";
import { CitizenShipType, useCitizenStore } from "@/store/citizen.store";
import { useWeb3React } from "@web3-react/core";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { ethers } from "ethers";
import { formatEther2Number } from "@/utils/format.address";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { toast } from "react-hot-toast";

interface CustomModalProps {
  isOpen: boolean;
  onClickClose: () => void;
}

type TextHandler = Record<keyof typeof CitizenShipType, string>;
const texts: TextHandler = {
  annualMemberShipPrice: "year",
  oneMonthMemberShipPrice: "month",
};

export const BuyPassportModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClickClose,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const bnbPrice = useBNBPrice();
  const { library, account } = useWeb3React();
  const {
    isCitizen,
    prices,
    updateStatusLoading,
    updatePricesLoading,
    buyCitizenShipLoading,
    subscriptionEndAt,
    updateCitizenShipStatus,
    updatePrices,
    buyCitizenShip,
  } = useCitizenStore();

  useEffect(() => {
    if (library && account?.length) {
      setIsConnected(true);
    } else setIsConnected(false);
  }, [library, account]);

  useEffect(() => {
    if (library && account) {
      updateCitizenShipStatus(library, account as string);
    }
  }, [isCitizen, library, account, updateCitizenShipStatus]);

  useEffect(() => {
    if (library) {
      updatePrices(library);
    }
  }, [library, updatePrices]);

  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);
  const PassportModalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<CitizenShipType>(
    CitizenShipType.annualMemberShipPrice
  );

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  useOnClickOutside(PassportModalRef, () => {
    onClickClose();
  });

  const priceMapper = (type: CitizenShipType) => {
    return `${(
      +normalizeValue(formatEther2Number(prices[type])) * bnbPrice
    ).toFixed(2)}$ / ${texts[type]}`;
  };

  const buyMemberShip = async () => {
    try {
      await buyCitizenShip(library, tab, account as string);
      //TODO => create an appropriate UI for this
      alert("congratulations and welcome to Centher");
    } catch (error: any) {
      //TODO => create an appropriate UI for this
      alert(
        "Ooops, something went wrong, please try again and if you found this problem still there contact us"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="buy-passport-portal">
      {
        <div
          className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
        >
          <div
            className={`flex h-full w-full max-w-[422px] flex-col overflow-auto border border-solid  border-[#2a2d3c]   bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
            ref={PassportModalRef}
          >
            {!isConnected ? (
              // TODO => this needs to UI
              <h3
                className={`animationTextHeading flex-grow text-center text-base font-semibold text-white fsm:text-xl`}
              >
                Connect your wallet first{" "}
              </h3>
            ) : (
              <>
                <div className={`flex items-start justify-between pb-6`}>
                  <div className="flex flex-col">
                    <h3
                      className={`animationTextHeading flex-grow text-left text-base font-semibold text-white fsm:text-xl`}
                    >
                      Centher Passport
                    </h3>
                    <h5 className="text-sm font-medium text-gray-shade-14 fsm:text-base">
                      Breaking the limit
                    </h5>
                  </div>
                  <button className="block sm:hidden" onClick={onClickClose}>
                    <IoClose className="ioCLose h-5 w-5 fill-white" />
                  </button>
                </div>
                <div className="mx-auto flex w-[90%] items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setTab(CitizenShipType.annualMemberShipPrice)
                    }
                    className={clsx(
                      `primary-gradient-btn text-14px flex-2 relative flex items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[#17171A] p-[1px] ${
                        tab === CitizenShipType.annualMemberShipPrice
                          ? "bg-gradient-pattern"
                          : "bg-gray-shade-3"
                      }`
                    )}
                  >
                    <div className="default-button-styling flex h-full w-full flex-grow items-center gap-2 rounded-[10px] bg-[#0B0B0B] ">
                      <span
                        className={clsx(
                          `relative ${
                            tab === CitizenShipType.annualMemberShipPrice
                              ? "primary-gradient-btn-text custom"
                              : "text-white"
                          }`
                        )}
                      >
                        Annualy
                      </span>
                      <span className="rounded-full bg-background-shade-3 py-[2px] px-2">
                        <span className="primary-gradient-btn-text custom relative text-xs font-medium">
                          Save 12%
                        </span>
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      setTab(CitizenShipType.oneMonthMemberShipPrice)
                    }
                    className={clsx(
                      `primary-gradient-btn text-14px relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[#17171A]  p-[1px] ${
                        tab === CitizenShipType.oneMonthMemberShipPrice
                          ? "bg-gradient-pattern"
                          : "bg-gray-shade-3"
                      }`
                    )}
                  >
                    <div className="default-button-styling flex h-full w-full flex-grow items-center justify-center gap-2 rounded-[10px] bg-[#0B0B0B] ">
                      <span
                        className={clsx(
                          `relative ${
                            tab === CitizenShipType.oneMonthMemberShipPrice
                              ? "primary-gradient-btn-text custom"
                              : "text-white"
                          }`
                        )}
                      >
                        Monthly
                      </span>
                    </div>
                  </button>
                </div>
                <Image
                  src={"/images/passport-banner.png"}
                  alt={"passport-banner"}
                  height={421}
                  width={251}
                  className="mt-5 w-full rounded-xl object-cover"
                />
                <div className="scrollSet mt-5 overflow-auto">
                  <div className="content w-full">
                    <div className="box rounded-xl border border-gray-shade-3 p-4">
                      <ul className="text-14px flex flex-col gap-2 font-medium text-white">
                        <li className="list-item-with-image">
                          Giveaway as a service
                        </li>
                        <li className="list-item-with-image">
                          Launchpad as a service
                        </li>
                        <li className="list-item-with-image">
                          Staking as a service
                        </li>
                        <li className="list-item-with-image">
                          Airdrop as a service
                        </li>
                        <li className="list-item-with-image">Bulk messaging</li>
                        <li className="list-item-with-image">
                          Create collections
                        </li>
                        <li className="list-item-with-image">Group chat</li>
                        <li className="list-item-with-image">Advertising</li>
                        <li className="list-item-with-image text-gradient">
                          And much more
                        </li>
                      </ul>
                    </div>
                    {/* TODO=> this needs to design */}
                    {!updateStatusLoading && isCitizen ? (
                      <h5 className="mt-2 mb-3 text-center text-sm font-medium text-gray-shade-14 fsm:text-base">
                        Youre already a citizen until{" "}
                        <strong className="text-gray-shade-1">
                          {new Date(+subscriptionEndAt * 1000).toDateString()}
                        </strong>
                        , if you purchase again, your citizenship will be
                        charged
                      </h5>
                    ) : (
                      ""
                    )}

                    <FinalButton
                      onClick={buyMemberShip}
                      title={priceMapper(tab)}
                      variant="primary"
                      className="text-14px mt-5 w-full py-3 hover:text-black"
                      isLoading={
                        updatePricesLoading || buyCitizenShipLoading
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      }
    </ModalPortal>
  );
};
