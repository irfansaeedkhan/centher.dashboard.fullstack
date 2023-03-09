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
import { MdClose } from "react-icons/md";
import {
  FiCamera,
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
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

import { ProfileTabsSocial } from "./profile.tabs.social";
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
  const verificationTick = useVerificationTick(user);

  const isOwnProfile = useMemo(() => {
    return (
      !!loggedInUser &&
      !!user &&
      loggedInUser.account_address.toLowerCase() ===
        user.account_address.toLowerCase()
    );
  }, [user, loggedInUser]);

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
    <div className={`rounded-xl bg-background-shade-3`}>
      <div
        className={clsx(
          `relative h-[180px] w-full rounded-t-xl bg-cover bg-no-repeat`,
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
            <div className="absolute right-2 bottom-2 flex items-center gap-x-3 fsm:right-4 fsm:bottom-3">
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
                  <FiCamera className="h-4 w-4" />
                  <span className="hidden fmd:inline-block">Edit Cover</span>
                </CoverUploadButton>
              )}
              {coverImage.newImage && (
                <div className="flex flex-col gap-2 fsm:flex-row fsm:gap-3">
                  <CoverUploadButton
                    variant="cancel"
                    onClick={setInitialCoverImage}
                  >
                    <MdClose className="h-4 w-4" />
                    <span className="hidden fmd:inline-block">Cancel</span>
                  </CoverUploadButton>
                  <CoverUploadButton
                    onClick={handleUploadCoverImage}
                    className={`group`}
                    variant="upload-cover"
                  >
                    <CgSpinner
                      className={`hidden h-4 w-4 animate-spin group-disabled:block`}
                    />
                    <FiCamera className={`h-4 w-4 group-disabled:hidden`} />
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
          className={`absolute left-[50%] -bottom-12 h-[112px] !w-[112px] translate-x-[-50%] cursor-pointer`}
        >
          <div className="relative h-[112px] !w-[112px]">
            <Image
              src={user.profile_image.path}
              alt={user.display_name}
              width={112}
              height={112}
              className="absolute top-[50%] left-[50%] !m-0 !h-[112px] !w-[112px] translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-background-shade-3 bg-black-shade-7 object-cover"
              sizes={"256px"}
            />
          </div>
        </div>
      </div>

      <div className={`relative px-2 fsm:px-4`}>
        {!!loggedInUser &&
          loggedInUser?.account_address.toLowerCase() !==
            user.account_address.toLowerCase() && (
            <div className="absolute -top-[45px] right-4 hidden w-full max-w-[122px] fmd:block">
              {loadingState ? (
                <button
                  className={clsx(
                    `text-14px flex h-[36px] w-full max-w-[122px] items-center justify-center rounded-xl py-2 px-2 font-bold`,
                    follow ? "bg-gray-shade-20" : "bg-brand-primary "
                  )}
                >
                  <CgSpinner className="animate-spin text-2xl" />
                </button>
              ) : (
                <Button
                  title={follow ? "Following" : "Follow"}
                  variant={follow ? "v5" : "v1"}
                  className={`flex w-full max-w-[122px] items-center justify-center gap-3 !px-4`}
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
          <div className="flex w-full justify-center">
            <div
              className={`flex flex-col items-baseline justify-between lg:flex-row`}
            >
              <h5
                className={clsx(
                  `inline-block items-center   break-words text-center text-base font-semibold text-white  
                  ${
                    !user.display_name.includes(" ") &&
                    user.display_name.length > 20 &&
                    "inline-block w-[90vw] break-words md:w-full"
                  }`,
                  !loggedInUser && `mt-6`
                )}
              >
                <span title={user.display_name}>
                  {sliceDisplayName(user.display_name)}
                </span>
                {!!verificationTick && (
                  <span className="verifiedIcon ml-0.5 inline-block h-[22px] w-[22px] fsm:ml-1">
                    <Image
                      src={verificationTick}
                      alt={"Verified"}
                      width={22}
                      height={22}
                      className="mt-[5px]"
                    />
                  </span>
                )}
              </h5>
            </div>
          </div>

          <div className="mt-1 flex w-full flex-col items-center justify-center">
            <div className={`relative flex items-center gap-2`}>
              <h6 className={`text-xs font-medium text-white`}>
                {sliceAccountAddress(user.account_address)}
              </h6>
              <button
                onClick={async () => {
                  await copyText(user.account_address);
                  toast.success("Address copied!");
                }}
              >
                <FiCopy className="h-4 w-4 text-gray-shade-7 hover:text-brand-primary" />
              </button>
            </div>

            <p className="mt-1 text-[11px] font-medium leading-6 text-gray-shade-7">
              Member since {dayjs(user.createdAt).format("MMM, YYYY")}
            </p>

            {!!loggedInUser &&
              loggedInUser?.account_address.toLowerCase() !==
                user.account_address.toLowerCase() && (
                <div className="mt-2 flex w-full max-w-[122px] justify-center fmd:hidden">
                  {loadingState ? (
                    <button
                      className={clsx(
                        `!text-14px flex h-[36px] w-full max-w-[122px] items-center justify-center rounded-xl py-2 px-2 font-bold`,
                        follow ? "bg-gray-shade-20" : "bg-brand-primary "
                      )}
                    >
                      <CgSpinner className="animate-spin text-2xl" />
                    </button>
                  ) : (
                    <Button
                      title={follow ? "Following" : "Follow"}
                      variant={follow ? "v5" : "v1"}
                      className={`flex w-full max-w-[122px] items-center justify-center gap-3 !px-4`}
                      onClick={() => followUser(user._id)}
                    />
                  )}
                </div>
              )}

            {!!loggedInUser && (
              <div className="mt-3 flex justify-center gap-5 flg:hidden">
                <div className="w-16 space-y-1.5 text-center">
                  <span className="block text-xs font-medium text-gray-shade-7">
                    Post
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {profileCardDetails.posts_count ?? "--"}
                  </span>
                </div>
                <div className="w-16 space-y-1.5 text-center">
                  <span className="block text-xs font-medium text-gray-shade-7">
                    Followers
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {profileCardDetails.followers_count ?? "--"}
                  </span>
                </div>
                <div className="w-16 space-y-1.5 text-center">
                  <span className="block text-xs font-medium text-gray-shade-7">
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
              className={`mx-auto mt-2 max-w-xl whitespace-pre-wrap break-words text-center text-xs font-normal tracking-wide text-gray-shade-16 fsm:text-[13px]`}
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
          <div className="mt-3 flex w-full items-center justify-center gap-4">
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
          mutualFollowersData?.users &&
          !!mutualFollowersData.users.length && (
            <FollowedComponent mutualFollowersData={mutualFollowersData} />
          )}

        <ProfileTabsSocial account_address={router.query.account_address} />
      </div>
    </div>
  );
};
export default ProfileHeader;

// styling
const socialLinks = `text-white w-4 h-4 hover:text-brand-primary`;
