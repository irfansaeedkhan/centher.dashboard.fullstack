import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";
import { IoClose } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import Button from "@/components/button";
import { ModalPortal } from "@/components/modal/modal.portal";
import { ConnectWalletComp } from "@/components/connect.wallet";
import { CitizenShipType, useCitizenStore } from "@/store/citizen.store";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { formatEther2Number } from "@/utils/format.address";
import cn from "@/utils/cn";
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
  const bnbPrice = useBNBPrice();
  const { getSigner, connectWallet, connectedAddress } = useWallet();

  const {
    isCitizen,
    prices,
    updatePricesLoading,
    buyCitizenShipLoading,
    updateCitizenShipStatus,
    updatePrices,
    buyCitizenShip,
  } = useCitizenStore();

  useEffect(() => {
    const signer = getSigner();
    if (signer && connectedAddress?.length) {
      setIsConnected(true);
    } else setIsConnected(false);
  }, [getSigner, connectedAddress]);

  useEffect(() => {
    const signer = getSigner();
    if (signer && connectedAddress) {
      updateCitizenShipStatus(signer!, connectedAddress);
    }
  }, [isCitizen, getSigner, connectedAddress, updateCitizenShipStatus]);

  useEffect(() => {
    const signer = getSigner();
    if (signer) {
      updatePrices(signer!);
    }
  }, [getSigner, updatePrices]);

  const PassportModalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<CitizenShipType>(
    CitizenShipType.annualMemberShipPrice
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
      if (connectedAddress) {
        await buyCitizenShip(getSigner()!, tab, connectedAddress);
        setshowMsg(<CitizenShipSuccessModal />);
      }
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
                        Staking as a service
                      </li>
                      <li className="list-item-with-image">
                        Create collections
                      </li>
                      <li className="list-item-with-image">Create NFT</li>
                      <li className="list-item-with-image">
                        Airdrop as a service
                      </li>
                      <li className="list-item-with-image">
                        Launchpad as a service
                      </li>
                      <li className="list-item-with-image">
                        Unlimited post length
                      </li>
                      <li className="list-item-with-image">
                        Giveaway as a service (Coming Soon)
                      </li>
                      <li className="list-item-with-image">
                        Bulk messaging (Private and Public Groups)
                      </li>
                      <li className="list-item-with-image">
                        Group chat (Coming Soon)
                      </li>
                      <li className="list-item-with-image">
                        Advertising (Coming Soon)
                      </li>
                      <li className="list-item-with-image textGradient">
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
                    <ConnectWalletComp
                      authType="login"
                      connectWallet={connectWallet}
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
