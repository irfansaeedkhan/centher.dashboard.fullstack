import React, { useEffect, useState } from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import clsx from "clsx";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import toast from "react-hot-toast";
import { MdOutlineInfo } from "react-icons/md";
import {
  GradientCopy,
  NewDiscordIcon,
  WebsiteIcon,
  XLogo,
} from "@/assets/svgs";
import dayjs from "dayjs";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import Button from "@/components/button";
import { LaunchpadListEnum } from "@/pages/launchpad/create-launchpad/_components/shared-enum";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { StandardModal } from "@/components/modal/standard.modal";
import { ProgressModalShared } from "@/components/shared";
import Link from "next/link";
import { formatIPFSUrl } from "@/utils/format.address";
import axios from "axios";
import { TelegramIcon } from "react-share";

interface PresaleDataProps extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
  description: string;
  presaleActive: boolean;
}

export const PresaleData: React.FC<PresaleDataProps> = ({
  token_name,
  token_symbol,
  description,
  token,
  roundInfos,
  maxTokensToSell,
  minTokensToSell,
  releaseMonth,
  presaleActive,
  fundType,
  roundDeep,
  metadata,
}) => {
  const { getSigner } = useWallet();
  const [modalTitle, setModalTitle] = useState("");
  const [progressModel, setProgressModel] = useState(false);
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const [successModal, setSuccessModal] = useState<false | string>(false);

  const [socials, setSocials] = useState<{
    token_name: string;
    token_symbol: string;
    logo_url: string;
    website_url: string;
    facebook: string;
    twitter: string;
    github: string;
    telegram: string;
    instagram: string;
    discord: string;
    reddit: string;
    description: string;
  }>({
    token_name: "",
    token_symbol: "",
    logo_url: "",
    website_url: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    description: "",
  });

  const [refund, setRefund] = useState(false);

  const endOfPresale = Number(roundInfos[Number(roundDeep) - 1].endTime);

  const StaticTokenData = {
    symbol: "ECOPAW",
    whitepaper_url: "https://ecopaw.io/files/ecopaw-whitepaper.pdf",
  };

  let totalSupplyForSell = 0;
  for (let i = 0; i < roundInfos.length; i++) {
    totalSupplyForSell +=
      (Number(roundInfos[i].tokensToSell) * 1e18) /
      Number(roundInfos[i].pricePerToken);
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(formatIPFSUrl(metadata));
        setSocials({
          token_name: result.data.token_name,
          token_symbol: result.data.token_symbol,
          logo_url: result.data.logo_url,
          website_url: result.data.website_url,
          facebook: result.data.facebook,
          twitter: result.data.twitter,
          github: result.data.github,
          telegram: result.data.telegram,
          instagram: result.data.instagram,
          discord: result.data.discord,
          reddit: result.data.reddit,
          description: result.data.description,
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [metadata]);

  const doRefund = async () => {
    setProgressModel(true);
    setModalTitle(LaunchpadListEnum.refund_tokens);
    const signer = getSigner();
    if (!signer) return;

    try {
      await BlockchainWrite.getRefund(signer, token);
      setRefund(true);
      setProgressModel(false);
    } catch (error: any) {
      setProgressModel(false);
      let errorMessage = "Approval tx failed";
      if (error.reason?.toLowerCase().includes("user rejected")) {
        errorMessage = "User rejected the transaction";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else {
        errorMessage = error?.message ?? errorMessage;
      }
      setErrorModal(errorMessage ?? "Something went wrong!");
    }
  };

  return (
    <>
      {progressModel && <ProgressModalShared title={modalTitle} />}
      {errorModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={errorModal ? true : false}
          title="Transaction Failed"
          subtitle="Transaction Failed"
          bodyText={errorModal ? errorModal : ""}
          status="error"
          onClickClose={() => setErrorModal(false)}
          onClickConfirm={() => setErrorModal(false)}
        />
      )}
      {successModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={successModal ? true : false}
          title="Transaction Successful"
          subtitle="Transaction Successful"
          bodyText={successModal ? successModal : ""}
          status="success"
          onClickClose={() => setSuccessModal(false)}
          onClickConfirm={() => setSuccessModal(false)}
        />
      )}
      <div className="flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-xl font-semibold leading-7 text-white">
            {token_name} Presale
          </h2>
          <span className="rounded-10px bg-brand-primary/[0.16] px-3 text-xs font-semibold leading-6 text-brand-primary">
            {/* Upcoming  */}{" "}
            {/* {Number(roundInfos[0].startTime) < Number(new Date())
            ? "Active"
            : "Upcoming"} */}
            {presaleActive ? "Active" : "Upcoming"}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-shade-14">{description}</p>
        <div className="flex flex-col gap-4 pb-4">
          <div className={mainDiv}>
            <div className={textLeft}>Token Name</div>
            <div className={textRight}>{token_name}</div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Token Address</div>
            <div className={clsx(textRight, "group")}>
              <span className="group-hover:textGradient">
                {sliceAccountAddress(token)}
              </span>
              <GradientCopy
                className="cursor-pointer"
                onClick={async () => {
                  await copyText(token ?? "");
                  toast.success("Token address copied!");
                }}
              />
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Symbol</div>
            <div className={textRight}>{token_symbol}</div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Total supply</div>
            <div className={textRight}>
              {Number(normalizeValue(formatUnits(maxTokensToSell, 18))).toFixed(
                fundType === 0 ? 4 : 0
              )}
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Soft cap</div>
            <div className={textRight}>
              {Number(normalizeValue(formatUnits(minTokensToSell, 18))).toFixed(
                fundType === 0 ? 4 : 0
              )}
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Hard cap</div>
            <div className={textRight}>
              {Number(normalizeValue(formatUnits(maxTokensToSell, 18))).toFixed(
                fundType === 0 ? 4 : 0
              )}
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Presale start time</div>
            <div className={textRight}>
              {dayjs(Number(roundInfos[0].startTime) * 1000).format(
                "DD-MMM-YYYY HH:mm:A"
              )}
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Presale end time</div>
            <div className={textRight}>
              {dayjs(
                Number(roundInfos[roundInfos.length - 1].endTime) * 1000
              ).format("DD-MMM-YYYY HH:mm:A")}
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Vesting Period</div>
            <div className={textRight}>
              {releaseMonth} {releaseMonth === "1" ? "Month" : "Months"}
            </div>
          </div>
          {/* <div className={mainDiv}>
            <div className={textLeft}>Lock Period</div>
            <div className={textRight}>
              {roundInfos[0].lockMonths}{" "}
              {roundInfos[0].lockMonths === "1" ? "Month" : "Months"}
            </div>
          </div> */}

          {StaticTokenData.symbol === token_symbol ? (
            <div className={mainDiv}>
              <div className={textLeft}>Whitepaper</div>
              <div className={textRight}>
                <Link
                  className="flex items-center"
                  href={StaticTokenData.whitepaper_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <XLogo className="h-5 w-5 fill-white" />
                  <span className="ml-2">{StaticTokenData.whitepaper_url}</span>
                </Link>
              </div>
            </div>
          ) : null}

          <div className={mainDiv}>
            <div className={textLeft}>Socials</div>
            <div className={textRight}>
              <Link
                className="flex items-center"
                href={
                  socials.twitter.includes("https://")
                    ? socials.twitter
                    : `https//${socials.twitter}`
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <XLogo className="h-5 w-5 fill-white" />
                <span className="ml-2">{socials.twitter}</span>
              </Link>
            </div>
          </div>

          <div className={mainDiv}>
            <div className={textLeft}></div>
            <div className={textRight}>
              <Link
                className="flex items-center"
                href={
                  socials.telegram.includes("https://")
                    ? socials.telegram
                    : `https//${socials.telegram}`
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <TelegramIcon className="h-5 w-5 fill-white" />
                <span className="ml-2">{socials.telegram}</span>
              </Link>
            </div>
          </div>

          <div className={mainDiv}>
            <div className={textLeft}></div>
            <div className={textRight}>
              <Link
                className="flex items-center"
                href={
                  socials.discord.includes("https://")
                    ? socials.discord
                    : `https//${socials.discord}`
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <NewDiscordIcon className="h-5 w-5 " />
                <span className="ml-2">{socials.discord}</span>
              </Link>
            </div>
          </div>

          <div className={mainDiv}>
            <div className={textLeft}>Listing on</div>
            <div className={textRight}>
              <Link
                className="flex items-center"
                href={
                  socials.twitter.includes("https://")
                    ? socials.twitter
                    : `https//${socials.website_url}`
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <WebsiteIcon className="h-5 w-5" />
                <span className="ml-2">{socials.website_url}</span>
              </Link>
            </div>
          </div>
          {!refund &&
          Number(minTokensToSell) > 0 &&
          Date.now() / 1000 > endOfPresale ? (
            <div className={mainDiv}>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-shade-14">
                <MdOutlineInfo className="flex size-5 flex-shrink-0 " />
                <span className="text-danger">Note: </span>
                The Launchpad did not reach the soft cap for the presale.{" "}
              </p>
              <Button
                title="Get Refund"
                className="flex h-9 w-full max-w-[132px] items-center justify-center text-sm font-medium "
                borderRounded="10px"
                onClick={() => {
                  doRefund();
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm flex-shrink-0 font-medium text-white flex items-center gap-1";
