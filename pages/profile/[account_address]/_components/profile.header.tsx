import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import clsx from "clsx";
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
import dayjs from "dayjs";

import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import useUser from "@/hooks/use.user";
import { CoverImage, MutualFollowersData, User } from "@/models/user";
import Button from "@/components/button";
import { useGetProfileCardDetails } from "@/components/feed.components/profile.detail.card/use.get.profile.card.details";
import { axiosNodeApi } from "@/utils/axios";
import { updateUserImage, sliceAccountAddress } from "@/utils/user.helpers";
import { customLog } from "@/utils/custom.log";
import { copyText } from "@/utils/copy.text";
import { AppRoutes } from "@/constants/app.routes";
import {
  DefaultCircle,
  GoldCircle,
  RainbowCircle,
  SilverCircle,
} from "@/assets/svgs";

import { ProfileTabsSocial } from "./profile.tabs.social";
import { ProfileTabsNFT } from "./profile.tabs.nft";
import { CoverUploadButton } from "./cover.upload.button";
import { useDragCoverImage } from "./use.drag.cover.image";
import Profile3DotsMenu from "./profile.3.dots.menu";
import CropperImage from "./cropper.image";
import FollowedComponent from "./followed.component";
export type CoverImageWithFile = Partial<CoverImage> & {
  blob: File | null;
  newImage: boolean;
  preview?: string;
};

interface Props {
  mutualFollowersData: MutualFollowersData | null;
  user: User;
  mutateUser: (userPartial: Partial<User>) => Promise<void>;
}

const ProfileHeader: React.FC<Props> = ({
  mutualFollowersData,
  user,
  mutateUser,
}) => {
  const router = useRouter();
  const profileCardDetails = useGetProfileCardDetails(user);
  const { incrementFollowersCount, decrementFollowersCount } =
    useProfileCardStore((state) => ({
      incrementFollowersCount: state.incrementFollowersCount,
      decrementFollowersCount: state.decrementFollowersCount,
    }));

  const { removeUnfollowedUserPosts } = useFeedStore((state) => ({
    removeUnfollowedUserPosts: state.removeUnfollowedUserPosts,
  }));

  const { user: loggedInUser } = useUser();

  const { imagePosition } = useDragCoverImage();
  const [coverImage, setCoverImage] = useState<CoverImageWithFile>({
    ...user?.cover_image,
    blob: null,
    newImage: false,
    preview: "",
  });
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [follow, setFollow] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [verifyIcon, setVerifyIcon] = useState<string>("");

  const isOwnProfile = useMemo(() => {
    return (
      !!loggedInUser &&
      !!user &&
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
        preview: "",
      });
    }
  }, [user?.cover_image]);

  useEffect(() => {
    setInitialCoverImage();
  }, [setInitialCoverImage]);

  const verificationTick = useVerificationTick(user);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const { data } = await axiosNodeApi.get(
          `/api/socials/follows/${user?._id}`
        );
        setFollow(data.follow);
      } catch (error: any) {
        customLog(error, ["development"]);
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

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setCoverImage((prev) => ({
        ...prev,
        object_name: file.name,
        path: reader.result as string,
        blob: file,
        preview: previewUrl,
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
        removeUnfollowedUserPosts(following_id);
      }
      setLoadingState(false);
    } catch (error: any) {
      setLoadingState(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <div className={`bg-background-shade-3 rounded-2xl`}>
      <div
        className={clsx(
          `relative rounded-t-2xl bg-no-repeat w-full h-[180px] bg-cover`,
          {
            "cursor-move": coverImage.newImage,
          }
        )}
        style={{
          backgroundImage: `url(${coverImage.path})`,
          backgroundPosition: `center center`,
        }}
      >
        {isOwnProfile && (
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
                  <span className="hidden fmd:inline-block">Edit Cover</span>
                </CoverUploadButton>
              )}
              {coverImage.newImage && (
                <div className="flex fsm:flex-row flex-col fsm:gap-3 gap-2">
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
                </div>
              )}
            </div>

            <CropperImage
              coverImage={coverImage}
              setCoverImage={setCoverImage}
            />
          </>
        )}

        <div
          className={`cursor-pointer absolute left-[50%] translate-x-[-50%] -bottom-12 h-[112px] !w-[112px]`}
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
            {!!verificationTick ? (
              <RainbowCircle
                className={clsx(
                  `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[112px] !w-[112px] object-cover`
                )}
              />
            ) : (
              <DefaultCircle
                className={clsx(
                  `absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] !h-[112px] !w-[112px] object-cover`
                )}
              />
            )}

            {!!verificationTick && (
              <div className="verifiedIcon absolute bottom-[2px] right-[-4px] !h-[34px] !w-[34px] !m-0">
                <Image
                  src={verificationTick}
                  alt={"Verified"}
                  width={34}
                  height={34}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`relative px-2 fsm:px-4`}>
        {!!loggedInUser &&
          loggedInUser?.account_address.toLowerCase() !==
            user.account_address.toLowerCase() && (
            <div className="absolute right-4 w-full max-w-[122px] fmd:block hidden">
              {loadingState ? (
                <button
                  className={clsx(
                    `text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-full max-w-[122px] h-[36px]`,
                    follow ? "bg-gray-shade-20" : "bg-brand-primary "
                  )}
                >
                  <CgSpinner className="animate-spin text-2xl" />
                </button>
              ) : (
                <Button
                  title={follow ? "Following" : "Follow"}
                  variant={follow ? "v5" : "v1"}
                  className={`!px-4 flex items-center justify-center gap-3 w-full max-w-[122px]`}
                  onClick={() => followUser(user._id)}
                />
              )}
            </div>
          )}

        <Profile3DotsMenu
          isOwnProfile={isOwnProfile}
          loggedInUser={loggedInUser}
        />

        <div className={`!mt-14`}>
          <div className="w-full justify-center flex">
            <div
              className={`flex flex-col lg:flex-row items-baseline justify-between`}
            >
              <h5
                className={clsx(
                  loggedInUser
                    ? `text-center text-white text-20px font-semibold text-ellipsis line-clamp-1`
                    : "text-center text-white text-20px font-semibold text-ellipsis line-clamp-1 mt-6"
                )}
              >
                {user.display_name}
              </h5>
            </div>
          </div>

          <div className="w-full justify-center flex flex-col items-center">
            <div className={`flex items-center gap-2 relative`}>
              <h6 className={`text-white text-14px font-semibold`}>
                {sliceAccountAddress(user.account_address)}
              </h6>
              <button
                onClick={async () => {
                  await copyText(user.account_address);
                  toast.success("Address copied!");
                }}
              >
                <FiCopy className="w-4 h-4 hover:text-brand-primary text-gray-shade-7" />
              </button>
            </div>
            <p className="text-[11px] mt-1 leading-6 font-medium text-gray-shade-7">
              Member since {dayjs(user.createdAt).format("MMM, YYYY")}
            </p>

            {!!loggedInUser &&
              loggedInUser?.account_address.toLowerCase() !==
                user.account_address.toLowerCase() && (
                <div className="max-w-[122px] fmd:hidden flex w-full justify-center mt-3">
                  {loadingState ? (
                    <button
                      className={clsx(
                        `!text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-full max-w-[122px] h-[36px]`,
                        follow ? "bg-gray-shade-20" : "bg-brand-primary "
                      )}
                    >
                      <CgSpinner className="animate-spin text-2xl" />
                    </button>
                  ) : (
                    <Button
                      title={follow ? "Following" : "Follow"}
                      variant={follow ? "v5" : "v1"}
                      className={`!px-4 flex items-center justify-center gap-3 w-full max-w-[122px]`}
                      onClick={() => followUser(user._id)}
                    />
                  )}
                </div>
              )}
            {!!loggedInUser &&
              loggedInUser?.account_address.toLowerCase() !==
                user.account_address.toLowerCase() && (
                <div className="flex justify-center gap-5 mt-3 flg:hidden">
                  <div className="text-center space-y-1.5 w-16">
                    <span className="text-xs font-medium block text-gray-shade-7">
                      Post
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {profileCardDetails.posts_count ?? "--"}
                    </span>
                  </div>
                  <div className="text-center space-y-1.5 w-16">
                    <span className="text-xs font-medium block text-gray-shade-7">
                      Followers
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {profileCardDetails.followers_count ?? "--"}
                    </span>
                  </div>
                  <div className="text-center space-y-1.5 w-16">
                    <span className="text-xs font-medium block text-gray-shade-7">
                      Following
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {profileCardDetails.following_count ?? "--"}
                    </span>
                  </div>
                </div>
              )}
          </div>
          {user.profile_bio && (
            <p
              className={`text-sm mt-3 text-center break-words font-normal leading-6 text-gray-shade-16 whitespace-pre-wrap max-w-[776px] mx-auto`}
            >
              {user.profile_bio}
            </p>
          )}
        </div>

        {(user.tiktok_username ||
          user.facebook_username ||
          user.instagram_username ||
          user.onlyfans_username ||
          user.twitch_username ||
          user.twitter_username ||
          user.website_url ||
          user.youtube_url) && (
          <div className="w-full justify-center flex mt-2 items-center gap-4">
            {user.tiktok_username && (
              <a
                href={`https://tiktok.com/@${user.tiktok_username}`}
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
              <a href={`${user.youtube_url}`} target="_blank" rel="noreferrer">
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
        )}

        {!!loggedInUser &&
          loggedInUser?.account_address.toLowerCase() !==
            user.account_address.toLowerCase() &&
          mutualFollowersData?.users && (
            <FollowedComponent mutualFollowersData={mutualFollowersData} />
          )}

        {currentPageRoute.isProfilePage && (
          <ProfileTabsSocial account_address={router.query.account_address} />
        )}
        {currentPageRoute.isNFTProfilePage && (
          <ProfileTabsNFT account_address={router.query.account_address} />
        )}
      </div>
    </div>
  );
};
export default ProfileHeader;

// styling
const socialLinks = `text-white text-xl hover:text-brand-primary`;
