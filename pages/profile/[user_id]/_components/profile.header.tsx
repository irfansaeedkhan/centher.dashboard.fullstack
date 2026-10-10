import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { TbBrandTiktok, TbBrandTelegram } from "react-icons/tb";
import { RiFacebookCircleLine } from "react-icons/ri";
import { SiOnlyfans } from "react-icons/si";
import { HiLink } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import {
  FiCamera,
  FiCopy,
  FiInstagram,
  FiTwitch,
  FiYoutube,
} from "react-icons/fi";
import dayjs from "dayjs";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { LoggedInUser, MutualFollowersData, User } from "@/models/user";
import { getUserImageUploadUrl, updateUserImage } from "@/lib/user";
import ProfileModal from "@/components/modal/profile.modal";
import Button from "@/components/button";
import { useGetProfileCardDetails } from "@/components/feed.components/profile.detail.card/use.get.profile.card.details";
import { axiosApi369x } from "@/utils/axios";
import { getUserImageUrl, sliceAccountAddress } from "@/utils/user.helpers";
import { customLog } from "@/utils/custom.log";
import { copyText } from "@/utils/copy.text";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import cn from "@/utils/cn";
import { BackButton } from "@/components/button/back-button";
import { useProductLive } from "@/hooks/chat";
import { AppRoutes } from "@/constants/app.routes";
import { XLogo, ChatProfile, EyeOffFollow } from "@/assets/svgs";
import FollowedComponent from "../community/_components/followed.component";
import { ProfileTabsSocial } from "./profile.tabs.social";
import { CoverUploadButton } from "./cover.upload.button";
import Profile3DotsMenu from "./profile.3.dots.menu";
import CropperImage from "./cropper.image";

export type CoverImageWithFile = {
  path: string;
  object_name: string;
  blob: File | null;
  newImage: boolean;
  preview?: string;
};

interface Props {
  mutualFollowersData: MutualFollowersData | null;
  user: User;
  loggedInUser: LoggedInUser | undefined;
}

const ProfileHeader: React.FC<Props> = ({
  mutualFollowersData,
  user,
  loggedInUser,
}) => {
  const router = useRouter();
  const { adapter } = useProductLive();
  const profileCardDetails = useGetProfileCardDetails(user);
  const { incrementFollowersCount, decrementFollowersCount } =
    useProfileCardStore((state) => ({
      incrementFollowersCount: state.incrementFollowersCount,
      decrementFollowersCount: state.decrementFollowersCount,
    }));

  const { removeUnfollowedUserPosts } = useFeedStore((state) => ({
    removeUnfollowedUserPosts: state.removeUnfollowedUserPosts,
  }));

  const [coverImageLoading, setCoverImageLoading] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<CoverImageWithFile>({
    path: user?.cover_image,
    object_name: "",
    blob: null,
    newImage: false,
    preview: "",
  });
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [follow, setFollow] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const verificationTick = useVerificationTick({ user, shouldAnimate: true });

  const isOwnProfile = useMemo(() => {
    return (
      !!loggedInUser &&
      !!user &&
      loggedInUser._id.toLowerCase() === user._id.toLowerCase()
    );
  }, [user, loggedInUser]);

  // Set to initial cover image state
  const setInitialCoverImage = useCallback(() => {
    if (user?.cover_image) {
      setCoverImage({
        path: user.cover_image,
        object_name: "",
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
        let url = `/api/socials/followers/is-followed/${user?._id}`;
        if (
          !!loggedInUser &&
          process.env.NEXT_PUBLIC_APP_ENV !== "development"
        ) {
          url += `/with-auth`;
        }
        const { data } = await axiosApi369x.get(url);
        setFollow(data.is_followed);
      } catch (error: any) {
        customLog(["development"], error);
      }
    };
    if (user?._id) {
      fetchFollow();
    }
  }, [user, loggedInUser]);

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
    setIsUploading(true);
    setCoverImageLoading(true);
    if (!coverImage.blob) {
      setCoverImageLoading(false);
      return;
    }

    const button = e.currentTarget as HTMLButtonElement;
    button.disabled = true;

    try {
      const coverImageData: CoverImageWithFile = {
        ...coverImage,
      };

      // Get pre-signed URL from API
      const data = await getUserImageUploadUrl(
        coverImage.object_name!,
        "cover_image"
      );

      coverImageData.object_name = data.objectName;

      // Create form data
      const presignedPostData = data.presignedPostData;
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(
          key,
          presignedPostData.fields[key as keyof typeof presignedPostData.fields]
        );
      });
      formData.append("file", coverImage.blob);

      // Upload file to S3
      await axios.post(presignedPostData.url, formData);

      coverImageData.path = getUserImageUrl({
        type: "custom-image",
        object_name: data.objectName,
      });

      // Update profile image in DB
      updateUserImage({
        type: "cover_image",
        object_name: coverImageData.object_name!,
      });

      setCoverImage((prev) => ({
        ...prev,
        blob: null,
        newImage: false,
      }));

      button.disabled = false;
      setIsUploading(false);
      setCoverImageLoading(false);
    } catch (error: any) {
      button.disabled = false;
      setIsUploading(false);
      setCoverImageLoading(false);
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
      } else if (typeof error.response?.data?.message === "string") {
        // Phase 4: surface the API's honest message (e.g. 501 NOT_IMPLEMENTED).
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
    }
  };

  const followUser = async (following_id: string) => {
    try {
      setLoadingState(true);
      const response = await axiosApi369x.post("/api/socials/followers", {
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

  const handleImageClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const chatHandler = async () => {
    if (adapter) {
      const result = await adapter.createNewPrivateConversation({
        targetUser: user._id.toLowerCase(),
      });
      router.push(`/chat/${result}`);
    } else throw new Error("Invalid stream handler instance");
  };

  return (
    <>
      <BackButton className="flg:hidden" />

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
              <div className="absolute bottom-2 right-2 flex items-center gap-x-3 fsm:bottom-3 fsm:right-4">
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
                  <div className="flex flex-col items-end gap-2 fsm:flex-row fsm:gap-0">
                    <CoverUploadButton
                      variant="cancel"
                      onClick={setInitialCoverImage}
                    >
                      <Button
                        loaderIcon={<MdClose className="h-4 w-4" />}
                        title=""
                        variant="secondary"
                        className="inline-block fmd:hidden"
                        borderRounded="14px"
                      />
                      <Button
                        Icon={<MdClose className="h-4 w-4" />}
                        title="Cancel"
                        variant="secondary"
                        className="hidden w-max bg-[#18191d] fmd:flex"
                        borderRounded="14px"
                        disabled={isUploading}
                      />
                    </CoverUploadButton>
                    <CoverUploadButton
                      onClick={handleUploadCoverImage}
                      className={`group`}
                      variant="upload-cover"
                    >
                      <Button
                        title="Save"
                        variant="primary"
                        className="group flex fmd:hidden"
                        borderRounded="14px"
                      />

                      <Button
                        title="Upload Cover"
                        variant="primary"
                        className="hidden w-max fmd:inline-block"
                        borderRounded="14px"
                        loaderIcon={
                          coverImageLoading && (
                            <CgSpinner
                              className={`mx-auto h-4 w-4 animate-spin text-center text-white`}
                            />
                          )
                        }
                      />
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
            className={`absolute -bottom-12 left-[50%] h-[112px] !w-[112px] translate-x-[-50%] cursor-pointer`}
          >
            <div
              className="relative h-[112px] !w-[112px]"
              onClick={handleImageClick}
            >
              <Image
                src={user.profile_image}
                alt={user.display_name}
                width={112}
                height={112}
                className="absolute left-[50%] top-[50%] !m-0 !h-[112px] !w-[112px] translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-background-shade-3 bg-black-shade-7 object-cover"
                sizes={"256px"}
              />
            </div>
          </div>
        </div>
        <div className={`relative object-contain px-2 fsm:px-4`}>
          {!!loggedInUser &&
            loggedInUser?._id.toLowerCase() !== user._id.toLowerCase() && (
              <div
                className={clsx(
                  "absolute -top-[45px] right-4 hidden w-full gap-2 fmd:flex",
                  follow ? "max-w-[114px]" : "max-w-[54px]"
                )}
              >
                {follow && (
                  <div
                    className="flex h-10 w-[52px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3"
                    onClick={chatHandler}
                  >
                    <ChatProfile />
                  </div>
                )}
                <div
                  title={follow ? "Unfollow" : "Follow"}
                  className={clsx(
                    "flex h-10 w-[54px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[14px] border",
                    follow
                      ? " border-gray-shade-3"
                      : " gradient-border-3 p-[1px]"
                  )}
                  onClick={() => followUser(user._id)}
                >
                  {loadingState ? (
                    <CgSpinner className="animate-spin text-xl text-white" />
                  ) : follow ? (
                    <EyeOffFollow />
                  ) : (
                    <Image
                      src={"/images/gradient-eye.svg"}
                      alt={"Follow"}
                      width={24}
                      height={24}
                    />
                  )}
                </div>
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
                    `inline-block items-center break-words text-center text-base font-semibold text-white ${
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
                  {verificationTick ? (
                    <span className="verifiedIcon ml-0.5 inline-block h-[22px] w-[22px] min-w-[22px] pt-1 fsm:ml-1">
                      <Image
                        src={verificationTick}
                        alt={"Membership"}
                        width={22}
                        height={22}
                      />
                    </span>
                  ) : null}
                  {user.organization && (
                    <span
                      className={cn(
                        "verifiedIcon ml-0.5 inline-block h-[22px] w-[22px] min-w-[22px] rounded-full fsm:ml-1",
                        user.membership.status === "citizen" ? "pt-2" : "pt-1"
                      )}
                    >
                      <Image
                        src={user.organization.profile_image}
                        alt={user.organization.org_id}
                        width={22}
                        height={22}
                        className="cursor-pointer rounded-full"
                        onClick={() => {
                          if (!user.organization) return;
                          router.push({
                            pathname: AppRoutes.profile.user_id,
                            query: { user_id: user.organization.org_id },
                          });
                        }}
                      />
                    </span>
                  )}
                </h5>
              </div>
            </div>

            <div className="mt-1 flex w-full flex-col items-center justify-center">
              <div className={`relative flex items-center gap-2`}>
                <h6 className={`text-xs font-medium text-white`}>
                  {sliceAccountAddress(user._id)}
                </h6>
                <button
                  onClick={async () => {
                    await copyText(user._id);
                    toast.success("Address copied!");
                  }}
                >
                  <FiCopy className="text-gradient-hover h-4 w-4 text-gray-shade-7" />
                </button>
              </div>

              <p className="mt-1 text-[11px] font-medium leading-6 text-gray-shade-7">
                Member since {dayjs(user.createdAt).format("MMM, YYYY")}
              </p>

              {!!loggedInUser &&
                loggedInUser?._id.toLowerCase() !== user._id.toLowerCase() && (
                  <div
                    className={clsx(
                      "mt-2 flex w-full max-w-[106px] justify-center gap-2 fmd:hidden"
                    )}
                  >
                    {follow && (
                      <div
                        className="flex h-10 w-[52px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3"
                        onClick={chatHandler}
                      >
                        <ChatProfile />
                      </div>
                    )}
                    <div
                      title={follow ? "Unfollow" : "Follow"}
                      className={clsx(
                        "flex h-10 w-[54px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[14px] border",
                        follow
                          ? " border-gray-shade-3"
                          : " gradient-border-3 p-[1px]"
                      )}
                      onClick={() => followUser(user._id)}
                    >
                      {loadingState ? (
                        <CgSpinner className="animate-spin text-xl text-white" />
                      ) : follow ? (
                        <EyeOffFollow />
                      ) : (
                        <Image
                          src={"/images/gradient-eye.svg"}
                          alt={"Follow"}
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                  </div>
                )}

              {!!loggedInUser && (
                <div className="mt-3 flex justify-center gap-2 flg:hidden">
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
                  <div className="w-16 space-y-1.5 text-center">
                    <span className="block text-xs font-medium text-gray-shade-7">
                      Referrals
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {profileCardDetails.total_referrees ?? "--"}
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
          {(user.social_media.tiktok_username ||
            user.social_media.facebook_username ||
            user.social_media.instagram_username ||
            user.social_media.onlyfans_username ||
            user.social_media.twitch_username ||
            user.social_media.twitter_username ||
            user.social_media.website_url ||
            user.social_media.telegram_username ||
            user.social_media.youtube_url) && (
            <div className="mt-3 flex w-full items-center justify-center gap-4">
              {user.social_media.tiktok_username && (
                <a
                  href={`https://tiktok.com/@${user.social_media.tiktok_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TbBrandTiktok className={socialLinks} />
                </a>
              )}
              {user.social_media.facebook_username && (
                <a
                  href={`https://facebook.com/${user.social_media.facebook_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <RiFacebookCircleLine className={socialLinks} />
                </a>
              )}
              {user.social_media.twitter_username && (
                <a
                  href={`https://twitter.com/${user.social_media.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <XLogo className="h-5 w-5 fill-white hover:fill-brand-primary" />
                </a>
              )}
              {user.social_media.youtube_url && (
                <a
                  href={`${user.social_media.youtube_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiYoutube className={socialLinks} />
                </a>
              )}
              {user.social_media.website_url && (
                <a
                  href={user.social_media.website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <HiLink className={socialLinks} />
                </a>
              )}

              {user.social_media.instagram_username && (
                <a
                  href={`https://instagram.com/${user.social_media.instagram_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiInstagram className={socialLinks} />
                </a>
              )}
              {user.social_media.twitch_username && (
                <a
                  href={`https://twitch.tv/${user.social_media.twitch_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiTwitch className={socialLinks} />
                </a>
              )}

              {user.social_media.onlyfans_username && (
                <a
                  href={`https://onlyfans.com/${user.social_media.onlyfans_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SiOnlyfans className={socialLinks} />
                </a>
              )}

              {user.social_media.telegram_username && (
                <a
                  href={`https://t.me/${user.social_media.telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TbBrandTelegram className={socialLinks} />
                </a>
              )}
            </div>
          )}
          {!!loggedInUser &&
            loggedInUser?._id.toLowerCase() !== user._id.toLowerCase() &&
            mutualFollowersData?.users &&
            !!mutualFollowersData.users.length && (
              <FollowedComponent mutualFollowersData={mutualFollowersData} />
            )}
          <ProfileTabsSocial user={user} loggedInUser={loggedInUser} />
        </div>
        {isModalOpen && (
          <ProfileModal onClose={handleCloseModal} src={user.profile_image} />
        )}
      </div>
    </>
  );
};
export default ProfileHeader;

// styling
const socialLinks = `text-white w-4 h-4 text-gradient-hover`;
