import React from "react";
import Image from "next/image";
import { FacebookIcon, LinkIconCollection, XIcon } from "@/assets/svgs";
import { LoggedInUser } from "@/models/user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface Props {
  watch: any;
  cover: Blob | undefined;
  profile: Blob | undefined;
  loggedInUser: LoggedInUser;
}

const CollectionPreview: React.FC<Props> = ({
  watch,
  cover,
  profile,
  loggedInUser,
}) => {
  const verificationTick = useVerificationTick({
    user: loggedInUser,
  });

  return (
    <div className="mt-3 p-4">
      <div className={coverCard}>
        <div className={`relative h-[31vh] w-full rounded-t-2xl`}>
          {cover && (
            <Image
              src={URL.createObjectURL(cover)}
              alt={"cover image"}
              fill
              className="rounded-2xl object-cover"
            />
          )}

          <div className={`text-14px absolute bottom-4 right-6`}>
            <div className={`relative`}>
              <div className="flex items-center justify-center gap-5">
                {(watch("facebook") ||
                  watch("twitter") ||
                  watch("yoursite")) && (
                  <div className="hidden h-[44px] w-[100px] items-center justify-center rounded-10px !bg-[rgba(23,23,26,0.30)] fsm:flex">
                    <div className="flex items-center justify-center gap-3">
                      {watch("facebook") && (
                        <a
                          href={watch("facebook")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FacebookIcon />
                        </a>
                      )}

                      {watch("twitter") && (
                        <a
                          href={watch("twitter")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <XIcon />
                        </a>
                      )}

                      {watch("yoursite") && (
                        <a
                          href={watch("yoursite")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinkIconCollection />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {profile && (
            <div className={profileImage}>
              <Image
                src={URL.createObjectURL(profile)}
                alt={"profile image"}
                width={112}
                height={112}
                className={collectionProfileImage}
                sizes={"512px"}
              />
            </div>
          )}
        </div>
        <div className={coverDetails}>
          <div className="mb-4 flex items-center justify-center gap-5 lg:mb-6 lg:justify-between">
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-lg font-semibold text-white lg:text-xl">
                {watch("name")}
              </p>
              <div className="mt-1 flex justify-center gap-1 text-left md:items-center lg:justify-start">
                <h6 className="text-14px min-w-max font-semibold text-gray-shade-18">
                  Created by
                </h6>
                <div
                  className={`text-14px flex max-w-[calc(100vw-140px)] items-center font-semibold text-gray-shade-18 hover:text-brand-primary`}
                  title={loggedInUser.display_name}
                >
                  <span className="block truncate break-words">
                    {sliceDisplayName(loggedInUser.display_name)}
                  </span>
                  {verificationTick && (
                    <span className="verifiedIcon ml-1 inline-flex h-5 w-5 min-w-[1.25rem]">
                      <Image
                        src={verificationTick}
                        alt={
                          loggedInUser?.membership.status === "citizen"
                            ? "Citizen"
                            : "Verified"
                        }
                        width={16}
                        height={16}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`hidden w-full max-w-fit flex-row flex-wrap items-center justify-between gap-5 rounded-2xl border-2 border-gray-shade-3 bg-gray-shade-9 px-7 py-4 fsm:w-auto fsm:gap-8 fmd:min-w-max lg:flex flg:justify-center [&>*]:w-[44%] fsm:[&>*]:w-[28%] fmd:[&>*]:w-auto`}
            >
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Items</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Listed</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Owner</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Floor Price</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Market Price</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
              <div className="text-left fmd:text-center">
                <h4 className={detailsCardTitle}>Total Volume</h4>
                <h5 className={detailsCardValue}>--</h5>
              </div>
            </div>
          </div>
          <div>
            <p className={profileDescription}>{watch("description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreview;

const coverCard = `
rounded-xl
`;
const profileImage = `
 h-[112px] !w-[112px] cursor-pointer absolute translate-x-[-50%] left-[50%] lg:left-6 lg:translate-x-[0] -bottom-12
`;
const coverDetails = `
mt-10 lg:px-7 pt-4 pb-2 px-3
`;
const profileDescription = `
md:text-14px text-xs font-normal leading-6 text-gray-shade-16 word-break lg:text-start text-center
`;
const collectionProfileImage = `
 h-[112px] w-[112px] object-cover rounded-lg bg-black-shade-7 
`;

const detailsCardTitle = `
text-12px font-semibold text-gray-shade-7 mb-2
`;
const detailsCardValue = `
text-14px font-semibold text-white
`;
