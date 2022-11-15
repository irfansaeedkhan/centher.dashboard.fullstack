// React, Next, NPM Packages
import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Rings } from "react-loader-spinner";
import { CgSpinner } from "react-icons/cg";
import { TbBrandTiktok } from "react-icons/tb";
import { RiFacebookCircleLine } from "react-icons/ri";
import { SiOnlyfans } from "react-icons/si";
import { HiLink } from "react-icons/hi";
import { MdOutlineCameraEnhance, MdClose } from "react-icons/md";
import {
  FiCopy,
  FiInstagram,
  FiTwitch,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";

// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { CoverImage } from "@/models/user";
import Button from "@/components/button";
import UserProfileHeaderSkeleton from "@/components/loading.skeletons/user.profile.header";
import { axiosNodeApi } from "@/utils/axios";
import { updateUserImage, sliceAccountAddress } from "@/utils/user.helpers";
import { AppRoutes } from "@/constants/app.routes";
import { Circle } from "@/assets/svgs";

// Current directory imports
import { ProfileTabsSocial } from "./profile.tabs.social";
import { ProfileTabsNFT } from "./profile.tabs.nft";
import { CoverUploadButton } from "./cover.upload.button";
import { useDragCoverImage } from "./use.drag.cover.image";
// import NFTProfileTabs from "./nft.profile.tabs";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

type CoverImageWithFile = Partial<CoverImage> & {
  blob: File | null;
  newImage: boolean;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const ProfileHeader: React.FC<Props> = ({ className, ...props }) => {
  const { incrementFollowersCount, decrementFollowersCount } =
    useProfileCardStore((state) => {
      return {
        incrementFollowersCount: state.incrementFollowersCount,
        decrementFollowersCount: state.decrementFollowersCount,
      };
    });
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, mutateUser } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const { imagePosition, setImagePosition, handleMouseDown } =
    useDragCoverImage();
  const [coverImage, setCoverImage] = useState<CoverImageWithFile>({
    ...user?.cover_image,
    blob: null,
    newImage: false,
  });
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [_, copy] = useCopyToClipboard();
  const [follow, setFollow] = useState<boolean>(false);
  const [showFollowButton, setShowFollowButton] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [verifyIcon, setVerifyIcon] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>("#B1B1B1");
  /* 
Stroke colors :   #1B1C22 (rainbow)  #B1B1B1 (silver)  #E2BD3A (gold)
verification icon variants
Rainbow1  Rainbow2 RainbowLastFrame
gold1 gold2 goldLastFrame
silver1 silver2 silverLastFrame
*/
  const isCurrentUserLoggedInUser = useMemo(() => {
    return (
      loggedInUser &&
      user &&
      loggedInUser.account_address.toLowerCase() ===
        user.account_address.toLowerCase()
    );
  }, [user, loggedInUser]);

  const currentPageRoute = useMemo(
    () => ({
      isProfilePage:
        router.pathname === AppRoutes.profile.account_address ||
        router.pathname === AppRoutes.profile.following ||
        router.pathname === AppRoutes.profile.followers ||
        router.pathname === AppRoutes.profile.replies,
      isNFTProfilePage:
        router.pathname === AppRoutes.profile.nfts ||
        router.pathname === AppRoutes.profile.purchased ||
        router.pathname === AppRoutes.profile.collections,
    }),
    [router.pathname]
  );

  // Set to initial cover image state
  const setInitialCoverImage = useCallback(() => {
    if (user?.cover_image) {
      setCoverImage({
        ...user.cover_image,
        blob: null,
        newImage: false,
      });

      setImagePosition(user.cover_image.y);
    }
  }, [user?.cover_image, setImagePosition]);

  useEffect(() => {
    setInitialCoverImage();
  }, [setInitialCoverImage]);

  const iconVerifyProps = useVerificationTick(user?.account_address);
  // console.log("icon in profile header", iconVerify);

  useEffect(() => {
    if (iconVerifyProps === "rainbow") {
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/Rainbow1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/Rainbow2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/RainbowLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/Rainbow2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps === "silver") {
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/silver1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/silver2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/silverLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/silver2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps == "gold") {
      console.log("Inside Gold Index");
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/gold1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/gold2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/goldLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/gold2.gif");
      }, 20000);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    } else if (iconVerifyProps === "no-icon") {
      const timeout1 = setTimeout(function () {
        setVerifyIcon("/images/silver1.gif");
      }, 3000);
      const timeout2 = setTimeout(function () {
        setVerifyIcon("/images/silver2.gif");
      }, 4600);
      const interval1 = setInterval(() => {
        setVerifyIcon("/images/silverLastFrame.png");
      }, 9200);
      const interval2 = setInterval(() => {
        setVerifyIcon("/images/silver2.gif");
      }, 20000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearInterval(interval1);
        clearInterval(interval2);
      };
    }
  }, [iconVerifyProps, user?.account_address]);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const { data } = await axiosNodeApi.get(
          `/api/socials/follows/${user?._id}`
        );
        setFollow(data.follow);
        setShowFollowButton(true);
      } catch (error: any) {
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };
    if (user?._id) {
      fetchFollow();
    }
  }, [user]);

  // Handle cover image change
  const handleSelectCoverImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Make input value empty
    event.target.value = "";

    if (!file) {
      return;
    }

    // Only allow png, jpeg and jpg
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only png and jpg files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setCoverImage((prev) => ({
        ...prev,
        object_name: file.name,
        path: reader.result as string,
        blob: file,
        newImage: true,
      }));
    };
  };

  // Upload cover image change
  const handleUploadCoverImage = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!coverImage.blob) {
      return;
    }

    const button = e.currentTarget as HTMLButtonElement;
    button.disabled = true;

    try {
      const coverImageData: CoverImageWithFile = {
        ...coverImage,
      };

      // Get pre-signed URL from API
      const { data } = await axiosNodeApi.get(
        "/api/s3-upload/user-image?filename=" + coverImageData.object_name
      );

      coverImageData.object_name = data.objectName;

      // Create form data
      const presignedPostData = data.presignedPostData;
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });
      formData.append("file", coverImage.blob);

      // Upload file to S3
      await axios.post(presignedPostData.url, formData);

      coverImageData.path = presignedPostData.url + "/" + data.objectName;

      // Update profile image in DB
      updateUserImage({
        type: "cover_image",
        object_name: coverImageData.object_name!,
        path: coverImageData.path,
        y: imagePosition,
      });

      setCoverImage((prev) => ({
        ...prev,
        blob: null,
        newImage: false,
      }));

      mutateUser({
        cover_image: {
          object_name: coverImageData.object_name!,
          path: coverImageData.path,
          y: imagePosition,
        },
      });

      button.disabled = false;
    } catch (error: any) {
      button.disabled = false;
      process.env.NODE_ENV !== "production" && console.dir(error);
      let errorMsg = "Error uploading image";
      if (
        typeof error.response?.data === "string" &&
        error.response?.data.includes("EntityTooLarge")
      ) {
        errorMsg =
          "User image is too large. Please upload an image less than 5MB.";
      } else if (error.response?.data?.message_description) {
        errorMsg = error.response.data.message_description;
      }
      toast.error(errorMsg);
    }
  };

  const followUser = async (following_id: string) => {
    try {
      setLoadingState(true);
      const response = await axiosNodeApi.post("api/socials/follows", {
        following_id,
      });
      if (response.data.message == "follow_success") {
        setFollow(true);
        incrementFollowersCount();
      } else if (response.data.message == "unfollow_success") {
        setFollow(false);
        decrementFollowersCount();
      }
      setLoadingState(false);
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <div className={clsx(className)} {...props}>
      {user && loggedInUser ? (
        <div className={`bg-background-shade-3 rounded-2xl`}>
          <div
            onMouseDown={coverImage.newImage ? handleMouseDown : undefined}
            className={clsx(
              `relative rounded-t-2xl bg-no-repeat w-full h-[180px]`,
              {
                "cursor-move": coverImage.newImage,
              }
            )}
            style={{
              backgroundImage: `url(${coverImage.path})`,
              backgroundPosition: `center ${
                coverImage.newImage ? imagePosition : coverImage.y
              }`,
            }}
          >
            {isCurrentUserLoggedInUser && (
              <>
                <div className="flex gap-x-3 items-center absolute right-2 bottom-2 fsm:right-6 fsm:bottom-4">
                  <input
                    type="file"
                    ref={coverImageInputRef}
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleSelectCoverImage}
                  />
                  {!coverImage.newImage && (
                    <CoverUploadButton
                      onClick={() => {
                        coverImageInputRef.current?.click();
                      }}
                      variant="edit-cover"
                    >
                      <MdOutlineCameraEnhance className="w-4 h-4" />
                      <span className="hidden fmd:inline-block">
                        Edit Cover
                      </span>
                    </CoverUploadButton>
                  )}
                  {coverImage.newImage && (
                    <>
                      <CoverUploadButton
                        variant="cancel"
                        onClick={setInitialCoverImage}
                      >
                        <MdClose className="w-4 h-4" />
                        <span className="hidden fmd:inline-block">Cancel</span>
                      </CoverUploadButton>
                      <CoverUploadButton
                        onClick={handleUploadCoverImage}
                        className={`group`}
                        variant="upload-cover"
                      >
                        <CgSpinner
                          className={`group-disabled:block hidden animate-spin w-4 h-4`}
                        />
                        <MdOutlineCameraEnhance
                          className={`group-disabled:hidden w-4 h-4`}
                        />
                        <span className="hidden fmd:inline-block">
                          Upload Cover
                        </span>
                      </CoverUploadButton>
                    </>
                  )}
                </div>
              </>
            )}

            <div
              className={`cursor-pointer absolute  left-[50%] translate-x-[-50%] -bottom-12 h-[112px] !w-[112px]`}
            >
              <div className="relative h-[112px] !w-[112px]">
                <Image
                  src={user.profile_image.path}
                  alt={user.display_name}
                  width={112}
                  height={112}
                  className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full !h-[112px] !w-[112px] object-cover border-2 border-background-shade-3 !m-0 bg-black-shade-7"
                  sizes={"256px"}
                />
                <Circle
                  className={clsx(
                    `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[112px] !w-[112px] object-cover`,
                    iconVerifyProps === "rainbow" &&
                      "[&>*>*>*]: AnimatecircleRainbow"
                  )}
                />
                <div className="verifiedIcon absolute bottom-[2px] right-[-4px] !h-[34px] !w-[34px] !m-0">
                  {iconVerifyProps !== "no-icon" && (
                    <Image
                      src={verifyIcon}
                      alt={"verified icon"}
                      width={34}
                      height={34}
                      className=""
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-16 px-2 fsm:px-8 space-y-4 fmd:space-y-6`}>
            <div className={`space-y-2`}>
              <div className="w-full justify-center flex">
                <div
                  className={`flex flex-col lg:flex-row items-baseline justify-between`}
                >
                  <h5 className={`text-white text-20px font-semibold`}>
                    {user.display_name}
                  </h5>
                  <div className={`flex items-center gap-3`}></div>
                </div>
              </div>

              <div className="w-full justify-center flex">
                <div className={`flex items-center gap-2 relative`}>
                  <h6 className={`text-white text-14px font-semibold`}>
                    {sliceAccountAddress(user.account_address)}
                  </h6>
                  <button
                    onClick={() => {
                      copy(
                        window.location.origin +
                          "/auth/register?referred_by=" +
                          user.account_address
                      );
                      toast.success("Referral link copied!");
                    }}
                  >
                    <FiCopy className="w-4 h-4 hover:text-brand-primary text-gray-shade-7" />
                  </button>
                </div>
              </div>
            </div>

            {(user.tiktok_username ||
              user.facebook_username ||
              user.instagram_username ||
              user.onlyfans_username ||
              user.twitch_username ||
              user.twitter_username ||
              user.website_url ||
              user.youtube_url) && (
              <div className="w-full justify-center flex">
                <div className="flex items-center gap-3 py-3 px-4 bg-gray-shade-9 rounded-2xl">
                  {user.tiktok_username && (
                    <a
                      href={`https://tiktok.com/${user.tiktok_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TbBrandTiktok className={socialLinks} />
                    </a>
                  )}
                  {user.facebook_username && (
                    <a
                      href={`https://facebook.com/${user.facebook_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <RiFacebookCircleLine className={socialLinks} />
                    </a>
                  )}
                  {user.twitter_username && (
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiTwitter className={socialLinks} />
                    </a>
                  )}
                  {user.youtube_url && (
                    <a
                      href={`${user.youtube_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiYoutube className={socialLinks} />
                    </a>
                  )}
                  {user.website_url && (
                    <a href={user.website_url} target="_blank" rel="noreferrer">
                      <HiLink className={socialLinks} />
                    </a>
                  )}

                  {user.instagram_username && (
                    <a
                      href={`https://instagram.com/${user.instagram_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiInstagram className={socialLinks} />
                    </a>
                  )}
                  {user.twitch_username && (
                    <a
                      href={`https://twitch.tv/${user.twitch_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiTwitch className={socialLinks} />
                    </a>
                  )}

                  {user.onlyfans_username && (
                    <a
                      href={`https://onlyfans.com/${user.onlyfans_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <SiOnlyfans className={socialLinks} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {loggedInUser.account_address.toLowerCase() !==
              user.account_address.toLowerCase() && (
              <div className="w-full justify-center flex">
                {loadingState ? (
                  <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-full max-w-[157px] h-[36px]">
                    {/* TODO: Waqar Fix Loader size issue*/}
                    <Rings
                      height="20"
                      width="20"
                      color="#1C1F29"
                      radius="6"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="rings-loading"
                    />
                  </button>
                ) : (
                  <Button
                    title={follow ? "Unfollow" : "Follow"}
                    variant="v1"
                    className={`!px-4 flex items-center justify-center gap-3 w-full max-w-[157px]`}
                    onClick={() => followUser(user._id)}
                  />
                )}
              </div>
            )}

            {user.profile_bio && (
              <p
                className={`text-16px text-center font-normal leading-6 text-gray-shade-16 whitespace-pre-wrap max-w-[776px] mx-auto`}
              >
                {user.profile_bio}
              </p>
            )}

            {currentPageRoute.isProfilePage && (
              <ProfileTabsSocial
                account_address={router.query.account_address}
              />
            )}
            {currentPageRoute.isNFTProfilePage && (
              <ProfileTabsNFT account_address={router.query.account_address} />
            )}
          </div>
        </div>
      ) : (
        <UserProfileHeaderSkeleton />
      )}
    </div>
  );
};
export default ProfileHeader;

// styling
const socialLinks = `text-white text-xl hover:text-brand-primary`;
