import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { RiShareForwardLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import NftCollectionProfileSkeleton from "@/components/loading.skeletons/nft.collection.profile";
import { LoadingState } from "@/models/common";
import { CFSCollection, CollectionAdditionalInfo } from "@/models/nft";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { copyText } from "@/utils/copy.text";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { formatBNB2USD } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import {
  DotsIcon,
  FacebookCircleIcon,
  CopyIcon,
  TwitterSvg,
} from "@/assets/svgs";
import { BackButton } from "@/components/button/back-button";

const PLACEHOLDER_SQUARE_IMAGE = "/images/placeholder-square.svg";
const PLACEHOLDER_RECTANGLE_IMAGE = "/images/placeholder-rectangle.svg";

interface Props {
  collection: CFSCollection | null;
  collectionAdditionalInfo: CollectionAdditionalInfo | null;
  loadingCollection: LoadingState;
}

export const CollectionHeader: React.FC<Props> = ({
  collection,
  collectionAdditionalInfo,
  loadingCollection,
}) => {
  const router = useRouter();
  const bnbPrice = useBNBPrice();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${router.asPath}`;
    }
    return "";
  }, [router.asPath]);
  const [coverImageUrl, setCoverImageUrl] = useState(
    PLACEHOLDER_RECTANGLE_IMAGE
  );
  const [profileImageUrl, setProfileImageUrl] = useState(
    PLACEHOLDER_SQUARE_IMAGE
  );
  const verificationTick = useVerificationTick({
    user: collection?.creator_data,
  });

  useEffect(() => {
    if (collection) {
      setCoverImageUrl(
        collection.ipfs_metadata.coverIPFSHash ?? PLACEHOLDER_RECTANGLE_IMAGE
      );
      setProfileImageUrl(
        collection.ipfs_metadata.profileIPFSHash ?? PLACEHOLDER_SQUARE_IMAGE
      );
    }
  }, [collection]);

  useOnClickOutside(menuRef, () => {
    setIsMenuVisible(false);
    setIsMobileMenuVisible(false);
  });

  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
  };

  const toggleMobileMenu = async () => {
    setIsMobileMenuVisible((prev) => !prev);
  };

  const copyShareUrl = async () => {
    await copyText(shareUrl);
    toast.success("Collection link copied");
    setIsMenuVisible(false);
  };

  function formatNumber(number?: number | string) {
    if (typeof number === "number") {
      const formatter = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumSignificantDigits: 4,
      });
      return formatter.format(number);
    } else {
      return "N/A";
    }
  }

  return (
    <>
      <BackButton />
      {(loadingCollection === "loading" || loadingCollection === "idle") && (
        <NftCollectionProfileSkeleton />
      )}

      {loadingCollection === "failed" && (
        <div className="rounded-md border border-red-500 p-4 text-center text-base font-medium text-red-500">
          Could not load collection
        </div>
      )}

      {loadingCollection === "loaded" && collection && (
        <div className="rounded-xl bg-background-shade-3">
          <div className="relative h-[31vh] w-full rounded-t-2xl border-b border-gray-shade-5">
            {collection.ipfs_metadata.coverIPFSHash && (
              <Image
                src={coverImageUrl}
                alt={collection.ipfs_metadata.name}
                fill
                className="rounded-t-2xl object-cover"
                onError={() => setCoverImageUrl(PLACEHOLDER_RECTANGLE_IMAGE)}
              />
            )}

            <div className="absolute bottom-4 right-6 text-sm">
              <div ref={menuRef} className="relative">
                <div className="flex items-center justify-center gap-5">
                  {(collection.ipfs_metadata.facebook ||
                    collection.ipfs_metadata.twitter ||
                    collection.ipfs_metadata.yoursite) && (
                    <div className="hidden h-[44px] w-[100px] items-center justify-center rounded-10px !bg-[#17171A]/30 fsm:flex">
                      <div className="flex items-center justify-center gap-3">
                        {collection.ipfs_metadata.facebook && (
                          <a
                            href={collection.ipfs_metadata.facebook}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <TiSocialFacebook className="text-lg text-white hover:text-brand-primary" />
                          </a>
                        )}

                        {collection.ipfs_metadata.twitter && (
                          <a
                            href={collection.ipfs_metadata.twitter}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <TiSocialTwitter className="text-lg text-white hover:text-brand-primary" />
                          </a>
                        )}

                        {collection.ipfs_metadata.yoursite && (
                          <a
                            href={collection.ipfs_metadata.yoursite}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <TbWorld className="text-lg text-white hover:text-brand-primary" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    className={clsx("hidden fsm:flex", threeDotsBtn)}
                    onClick={toggleMenu}
                  >
                    <RiShareForwardLine className="h-[17px] w-[20px] [&>*]:fill-white [&>*]:stroke-white" />
                  </button>
                  <button
                    className={clsx("flex fsm:hidden", threeDotsBtn)}
                    onClick={toggleMobileMenu}
                  >
                    <DotsIcon className="[&>*]:fill-white [&>*]:stroke-white" />
                  </button>
                  <div
                    className={clsx(
                      "absolute right-0 top-10 w-[229px] overflow-hidden rounded-10px bg-black-shade-12 shadow-sm",
                      isMenuVisible ? "z-40 block" : "hidden"
                    )}
                  >
                    <button onClick={copyShareUrl} className={menuButton}>
                      <CopyIcon className={icon} /> Copy Link
                    </button>

                    <FacebookShareButton
                      onClick={() => {
                        setIsMenuVisible(false);
                      }}
                      url={shareUrl}
                      className="w-full"
                    >
                      <span className={menuButton}>
                        <FacebookCircleIcon className={icon} /> Share on
                        Facebook
                      </span>
                    </FacebookShareButton>

                    <TwitterShareButton
                      onClick={() => {
                        setIsMenuVisible(false);
                      }}
                      url={shareUrl}
                      className="w-full"
                    >
                      <span className={menuButton}>
                        <TwitterSvg className={icon} /> Share on Twitter
                      </span>
                    </TwitterShareButton>
                  </div>
                  <div
                    className={clsx(
                      "absolute right-0 top-10 w-[229px] overflow-hidden rounded-10px bg-black-shade-12 shadow-sm",
                      isMobileMenuVisible ? "z-40 block" : "hidden"
                    )}
                  >
                    {collection.ipfs_metadata.facebook && (
                      <a
                        href={collection.ipfs_metadata.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className={menuButton}
                      >
                        <TiSocialFacebook className={icon} /> Facebook Link
                      </a>
                    )}
                    {collection.ipfs_metadata.twitter && (
                      <a
                        href={collection.ipfs_metadata.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className={menuButton}
                      >
                        <TiSocialTwitter className={icon} /> Twitter Link
                      </a>
                    )}
                    {collection.ipfs_metadata.yoursite && (
                      <a
                        href={collection.ipfs_metadata.yoursite}
                        target="_blank"
                        rel="noreferrer"
                        className={menuButton}
                      >
                        <TbWorld className="h-6 w-6" /> Website Link
                      </a>
                    )}

                    <button onClick={copyShareUrl} className={menuButton}>
                      <CopyIcon className={icon} /> Copy Link
                    </button>

                    <FacebookShareButton url={shareUrl} className="w-full">
                      <span className={menuButton}>
                        <FacebookCircleIcon className={icon} /> Share on
                        Facebook
                      </span>
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} className="w-full">
                      <span className={menuButton}>
                        <TwitterSvg className={icon} /> Share on Twitter
                      </span>
                    </TwitterShareButton>
                  </div>
                </div>
              </div>
            </div>

            {collection.ipfs_metadata.profileIPFSHash && (
              <div className="absolute -bottom-12 left-[50%] h-[112px] !w-[112px] translate-x-[-50%] cursor-pointer lg:left-6 lg:translate-x-[0]">
                <Image
                  src={profileImageUrl}
                  alt={"profile image"}
                  width={112}
                  height={112}
                  className="h-[112px] w-[112px] rounded-full border-2 border-background-shade-3 bg-black-shade-7 object-cover"
                  sizes={"512px"}
                  onError={() => setProfileImageUrl(PLACEHOLDER_SQUARE_IMAGE)}
                />
              </div>
            )}
          </div>
          <div className="mt-8 px-7 pb-2 pt-7 lg:mt-6">
            <div className="flex flex-col items-center justify-center gap-5 text-center lg:flex-row lg:items-baseline lg:justify-between lg:text-left">
              <div className="w-full">
                <h5 className="word-break text-base font-semibold text-white f2xl:text-xl">
                  {collection?.name}
                </h5>
                <div className="lg:flex-start mt-1 flex justify-center gap-1 text-left md:items-center lg:justify-start">
                  <h6 className="min-w-max text-sm text-white">Created by</h6>
                  <Link
                    href={{
                      pathname: AppRoutes.profile.nfts,
                      query: {
                        user_id: collection?.creator_data._id,
                      },
                    }}
                    className="ml-1 flex max-w-[calc(100vw-140px)] items-center text-sm font-semibold text-gray-shade-18 hover:text-brand-primary"
                    title={collection?.creator_data?.display_name}
                  >
                    <span className="block truncate break-words">
                      {collection?.creator_data &&
                        sliceDisplayName(
                          collection?.creator_data?.display_name
                        )}
                    </span>
                    {!!verificationTick && (
                      <span className="verifiedIcon ml-1 inline-flex h-5 w-5 min-w-[1.25rem]">
                        <Image
                          src={verificationTick}
                          alt={
                            collection?.creator_data?.membership.status ===
                            "citizen"
                              ? "Citizen"
                              : "Verified"
                          }
                          width={16}
                          height={16}
                        />
                      </span>
                    )}
                  </Link>
                </div>
              </div>
              <div className="flex w-full max-w-fit flex-row flex-wrap items-center justify-between gap-5 rounded-2xl border-2 border-gray-shade-3 bg-gray-shade-9 px-7 py-4 fsm:w-auto fsm:gap-8 fmd:min-w-max flg:justify-center [&>*]:w-[44%] fsm:[&>*]:w-[28%] fmd:[&>*]:w-auto">
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Items</h4>
                  <h5 className={detailsCardValue}>
                    {collection?.totalSupply}
                  </h5>
                </div>
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Listed</h4>
                  <h5 className={detailsCardValue}>
                    {collectionAdditionalInfo?.listedPercent}%
                  </h5>
                </div>
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Owner</h4>
                  <h5 className={detailsCardValue}>
                    $
                    {collectionAdditionalInfo?.ownerIncome &&
                    collectionAdditionalInfo?.ownerIncome > 0
                      ? formatNumber(
                          formatBNB2USD(
                            collectionAdditionalInfo?.ownerIncome,
                            bnbPrice
                          )
                        )
                      : 0}
                  </h5>
                </div>
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Floor Price</h4>
                  <h5 className={detailsCardValue}>
                    $
                    {collectionAdditionalInfo?.minPrice &&
                    collectionAdditionalInfo?.minPrice > 0
                      ? formatNumber(
                          formatBNB2USD(
                            collectionAdditionalInfo?.minPrice,
                            bnbPrice
                          )
                        )
                      : 0}
                  </h5>
                </div>
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Market Price</h4>
                  <h5 className={detailsCardValue}>
                    ${formatNumber(Number(collection.tradingVolumn))}
                  </h5>
                </div>
                <div className="text-left fmd:text-center">
                  <h4 className={detailsCardTitle}>Total Volume</h4>
                  <h5 className={detailsCardValue}>
                    $
                    {formatNumber(
                      collection?.tradingVolumn &&
                        Number(collection.tradingVolumn) > 0
                        ? formatBNB2USD(collection.tradingVolumn, bnbPrice)
                        : 0
                    )}
                  </h5>
                </div>
              </div>
            </div>
            <div className="mb-4 mt-6">
              <p className="word-break text-sm font-normal leading-6 text-gray-shade-16">
                {collection.ipfs_metadata.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const menuButton = `w-full text-sm font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]`;
const icon = `w-[24px] h-[24px] [&>*]:stroke-white`;
const threeDotsBtn = `w-[44px] h-[44px] !bg-[#17171A]/30 flex items-center justify-center rounded-10px`;
const detailsCardTitle = `text-xs font-semibold text-gray-shade-7 mb-2`;
const detailsCardValue = `text-sm font-semibold text-white`;
