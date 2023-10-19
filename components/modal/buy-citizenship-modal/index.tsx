import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FiArrowRight } from "react-icons/fi";
import cn from "@/utils/cn";
import { ModalPortal } from "@/components/modal/modal.portal";
import { CitizenShipType, useCitizenStore } from "@/store/citizen.store";
import useUser from "@/hooks/use.user";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { formatEther2Number } from "@/utils/format.address";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { MetamaskIcon2 } from "@/assets/svgs";
import Button from "../../button";
import { CustomNewModal } from "../custom.new.modal";
import { CitizenShipSuccessModal } from "./success-modal";
import { CitizenShipFailureModal } from "./failure-modal";

interface CustomModalProps {
  isOpen: boolean;
  onClickClose: () => void;
}

type TextHandler = Record<keyof typeof CitizenShipType, string>;
const texts: TextHandler = {
  annualMemberShipPrice: "year",
  oneMonthMemberShipPrice: "month",
};

export const BuyCitizenshipModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClickClose,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showMsg, setshowMsg] = useState<any>(null);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { connectWallet } = useConnectWallet();
  const bnbPrice = useBNBPrice();
  const { library, account } = useWeb3React();
  const {
    isCitizen,
    prices,
    updatePricesLoading,
    buyCitizenShipLoading,
    updateCitizenShipStatus,
    updatePrices,
    buyCitizenShip,
  } = useCitizenStore();

  const { user: loggedInUser } = useUser();
  const { deactivate } = useWeb3React();

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
      if (event.key === "Escape" && !showMsg && !buyCitizenShipLoading) {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  useOnClickOutside(PassportModalRef, () => {
    if (!showMsg && !buyCitizenShipLoading) {
      onClickClose();
    }
  });

  const priceMapper = (type: CitizenShipType) => {
    return `${(
      +normalizeValue(formatEther2Number(prices[type])) * bnbPrice
    ).toFixed(2)}$ / ${texts[type]}`;
  };

  const retryFunc = () => {
    setshowMsg(null);
  };

  const buyMemberShip = async () => {
    try {
      await buyCitizenShip(library, tab, account as string);
      setshowMsg(<CitizenShipSuccessModal />);
    } catch (error: any) {
      setshowMsg(
        <CitizenShipFailureModal
          onClickClose={onClickClose}
          retryFunc={retryFunc}
        />
      );
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="buy-passport-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[422px] flex-col overflow-auto border border-solid  border-[#2a2d3c]   bg-black-shade-8 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          {showMsg ? (
            showMsg
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
                  <IoClose className="h-5 w-5 fill-white" />
                </button>
              </div>
              <div className="mx-auto flex w-[90%] items-center justify-center gap-2">
                <button
                  className={cn(
                    " relative flex w-full cursor-pointer items-center justify-center  gap-1 !rounded-[10px] py-[6px] text-xs font-semibold transition duration-100 ease-in-out before:rounded-[10px] before:bg-black-shade-8 after:rounded-[10px]",
                    tab === CitizenShipType.annualMemberShipPrice
                      ? "primary-gradient-btn bg-white"
                      : "border border-white bg-black-shade-8 text-white"
                  )}
                  onClick={() => setTab(CitizenShipType.annualMemberShipPrice)}
                >
                  <span className="primary-gradient-btn-text primary-btn-text-gradient relative py-1">
                    Annualy
                  </span>
                  <div className="z-30 rounded-full bg-[#17171A] px-2 py-[2px]">
                    <div className="primary-gradient-btn-text block w-max min-w-max text-xs font-medium">
                      Save 12%
                    </div>
                  </div>
                </button>
                <Button
                  title="Monthly"
                  onClick={() =>
                    setTab(CitizenShipType.oneMonthMemberShipPrice)
                  }
                  variant={
                    tab === CitizenShipType.oneMonthMemberShipPrice
                      ? "primary"
                      : "secondary"
                  }
                  className="w-full py-[10px] text-xs"
                  borderRounded="10px"
                />
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
                    <ul className="flex flex-col gap-2 text-sm font-medium text-white">
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
                  {/* now we are not adding this as discused with amjad */}
                  {/* {!updateStatusLoading && isCitizen ? (
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
                      )} */}
                  {!isConnected ? (
                    <Button
                      title={"Connect Wallet"}
                      variant="primary"
                      onClick={() => {
                        setConnectWalletModal(true);
                      }}
                      className="mx-auto mb-2 mt-6 w-[95%] py-3 text-sm"
                    />
                  ) : (
                    <Button
                      onClick={buyMemberShip}
                      title={priceMapper(tab)}
                      variant="primary"
                      className="mx-auto mb-2 mt-6 w-[95%] py-3 text-sm"
                      loaderIcon={
                        updatePricesLoading || buyCitizenShipLoading ? (
                          <CgSpinner className="h-5 animate-spin text-white" />
                        ) : undefined
                      }
                    />
                  )}

                  {connectWalletModal && (
                    <CustomNewModal
                      onClose={() => {
                        setConnectWalletModal(false);
                      }}
                      title={"Connect to wallet"}
                    >
                      <div className="mb-8 flex w-full justify-center px-5 md:px-10">
                        <p className="mt-2 w-full max-w-[366px] text-center text-sm text-gray-shade-14">
                          Please Connect your wallet to continue, the system
                          support following wallet.
                        </p>
                      </div>
                      <div className="flex w-full justify-center px-5 md:px-10">
                        <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary px-5 py-3">
                          <div className="flex items-center gap-3 fsm:gap-6">
                            <MetamaskIcon2 />
                            <h3 className="text-sm font-semibold text-white fmd:text-base">
                              Metamask
                            </h3>
                          </div>
                          <button
                            onClick={async () => {
                              if (!loggedInUser) {
                                toast.error(
                                  "Please login to buy this membership"
                                );
                                setConnectWalletModal(false);
                                return;
                              }
                              const _account = await connectWallet();
                              if (
                                loggedInUser._id.toLowerCase() !==
                                _account?.toLowerCase()
                              ) {
                                toast.error(
                                  "Please connect to correct account"
                                );
                                deactivate();
                              }
                              setConnectWalletModal(false);
                            }}
                          >
                            <FiArrowRight className="h-6 w-6 text-brand-primary fsm:h-8 fsm:w-8" />
                          </button>
                        </div>
                      </div>
                    </CustomNewModal>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
