import React from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { BNBIcon } from "@/assets/svgs";
import { LoggedInUser, User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import AudioPlayer from "./audio.player";

interface Props {
  asset: Blob | undefined;
  watch: any;
  selectedOption: any;
  changeNFTPrice: any;
  loggedInUser: LoggedInUser;
  assetTab: string;
  user: User;
}

const NftPreview: React.FC<Props> = ({
  asset,
  watch,
  assetTab,
  changeNFTPrice,
  selectedOption,
  loggedInUser,
  user,
}) => {
  const verificationTick = useVerificationTick({ user });

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col gap-8 flg:flex-row">
        <div className="h-[420px] w-full flex-shrink-0 rounded-[20px] flg:w-[508px]">
          {asset &&
            (assetTab === "Audio" ? (
              <div className="h-full w-full rounded-xl border border-gray-shade-3">
                <AudioPlayer
                  src={URL.createObjectURL(asset)}
                  srcObject={asset}
                />
              </div>
            ) : assetTab === "Video" ? (
              <div className="h-full w-full rounded-xl border border-gray-shade-3">
                <video
                  controls={true}
                  className="h-full w-full rounded-xl object-contain"
                >
                  <source
                    src={asset ? URL.createObjectURL(asset) : ""}
                    type="video/mp4"
                  />
                </video>
              </div>
            ) : (
              <Image
                src={URL.createObjectURL(asset)}
                alt={"cover_image"}
                width={508}
                height={395}
                className="h-full w-full rounded-2xl object-cover"
              />
            ))}
        </div>
        <div className="flex flex-grow flex-col justify-between gap-6 flg:w-[calc(100%-508px-64px)]">
          <span className="text-gradient word-break text-[34px] font-semibold leading-[42px]">
            {watch("NFTName")}
          </span>
          <div className={`grid grid-cols-1 gap-6`}>
            <div className="flex flex-grow items-start gap-3">
              {loggedInUser && (
                <Image
                  src={loggedInUser?.profile_image}
                  width={48}
                  height={48}
                  alt="profile"
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                />
              )}
              <div className="flex flex-grow flex-col gap-1">
                <h5 className="text-xs font-normal text-gray-shade-2">
                  Creator
                </h5>
                {loggedInUser ? (
                  <Link
                    href={{
                      pathname: AppRoutes.profile.owned,
                      query: {
                        user_id: user?._id,
                      },
                    }}
                    className={clsx(
                      "hover:text-gradient flex max-w-[230px] items-center text-sm font-semibold text-white f2xl:!max-w-[120px] [@media(min-width:400px)]:max-w-[300px] [@media(min-width:500px)]:max-w-[400px]"
                    )}
                    title={loggedInUser.display_name}
                  >
                    <span className="block truncate break-words">
                      {sliceDisplayName(loggedInUser.display_name)}
                    </span>
                    {verificationTick && (
                      <span className="verifiedIcon inline-flexh-[18px] ml-0.5 w-[18px] min-w-[18px] fsm:ml-1">
                        <Image
                          src={verificationTick}
                          alt={
                            loggedInUser.membership.status === "citizen"
                              ? "Citizen"
                              : "Verified"
                          }
                          width={16}
                          height={16}
                        />
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
                )}
              </div>
            </div>
            <div className="flex flex-grow items-start gap-3">
              <div className="flex flex-grow flex-col gap-1">
                <h5 className="text-xs font-normal text-gray-shade-2">
                  Collection
                </h5>
                <span
                  className={
                    "hover:text-gradient line-clamp-1 text-ellipsis text-sm font-semibold text-white"
                  }
                >
                  {sliceDisplayName(selectedOption)}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[100px] rounded-[20px] bg-elevation-1 p-6">
            <h6 className="text-sm text-gray-shade-14">Current Price</h6>
            <p className="mt-1 flex items-center gap-1 text-base font-bold text-white">
              <BNBIcon />
              <span>{changeNFTPrice}</span>
              <span>BNB</span>
            </p>
          </div>
          <div className="max-h-auto min-h-[152px] rounded-[20px] bg-elevation-1 p-6">
            <h6 className="text-sm text-white">Description</h6>
            <p className="word-break mt-1 flex items-center gap-1 text-sm text-gray-shade-1">
              {watch("Description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftPreview;
