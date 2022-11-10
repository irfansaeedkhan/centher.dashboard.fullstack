// React, Next, NPM Packages
import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import { Rings } from "react-loader-spinner";
import { CgSpinner } from "react-icons/cg";
import { FaFacebook, FaTiktok, FaTwitch, FaTwitter } from "react-icons/fa";
import { TbBrandTiktok } from "react-icons/tb";
import { RiFacebookCircleLine } from "react-icons/ri";
import { GrInstagram } from "react-icons/gr";
import { SiOnlyfans } from "react-icons/si";
import { HiLink } from "react-icons/hi";

// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { UserImage } from "@/models/user";
import Button from "@/components/button";
import UserProfileHeaderSkeleton from "@/components/loading.skeletons/user.profile.header";
import { axiosNodeApi } from "@/utils/axios";
import { updateUserImage, sliceAccountAddress } from "@/utils/user.helpers";
import { CopySvg, CameraIcon, EditIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import UserProfileTabs from "./user.profile.tabs";
import { CoverUploadButton } from "./cover.upload.button";
import NFTProfileTabs from "./nft.profile.tabs";
import { FiCopy, FiInstagram, FiTwitch, FiTwitter } from "react-icons/fi";
import clsx from "clsx";

type CoverImageWithFile = Partial<UserImage> & {
  blob: File | null;
  newImage: boolean;
};

const ProfileHeader: React.FC = () => {
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
  const [verifyIcon, setVerifyIcon] = useState<string>("/images/v1.gif");

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
    }
  }, [user?.cover_image]);

  useEffect(() => {
    setInitialCoverImage();
  }, [setInitialCoverImage]);

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

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const { data } = await axiosNodeApi.get(
          `/api/socials/follows/${user?._id}`
        );
        // setFollowUser && setFollowUser(data.follow);
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

  useEffect(() => {}, []);
  useLayoutEffect(() => {
    //Do something and either return undefined or a cleanup function
    return () => {
      //Do some cleanup here
      setTimeout(function () {
        setVerifyIcon("/images/v2.gif");
      }, 2500);
    };
  }, []);
  return (
    <div className={profilePageHeader}>
      <h1 className={title}>Profile</h1>
      <div className={btnContainer}>
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: user?.account_address,
            },
          }}
          className="w-full"
        >
          <Button
            title={"Social Profile"}
            variant={`${currentPageRoute.isProfilePage ? "v1" : "v2"}`}
            className="px-8 py-3"
          />
        </Link>
        <Link
          href={{
            pathname: AppRoutes.profile.nfts,
            query: {
              account_address: user?.account_address,
            },
          }}
          className="w-full"
        >
          <Button
            title={"NFT Profile"}
            variant={`${currentPageRoute.isNFTProfilePage ? "v1" : "v2"}`}
            className="px-8 py-3"
          />
        </Link>
      </div>
      {user && loggedInUser ? (
        <div className={coverCard}>
          <div
            className={coverImageContainer}
            style={{
              backgroundImage: `url(${coverImage.path})`,
            }}
          >
            {isCurrentUserLoggedInUser && (
              <>
                <div className="flex gap-x-3 items-center absolute right-6 bottom-4">
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
                    >
                      <CameraIcon />
                      Edit cover
                    </CoverUploadButton>
                  )}
                  {coverImage.newImage && (
                    <>
                      <CoverUploadButton
                        variant="dark"
                        onClick={setInitialCoverImage}
                      >
                        Cancel
                      </CoverUploadButton>
                      <CoverUploadButton
                        onClick={handleUploadCoverImage}
                        className={`group`}
                      >
                        <CgSpinner
                          className={`group-disabled:block hidden animate-spin w-4 h-4`}
                        />
                        <CameraIcon className={`group-disabled:hidden`} />
                        Upload Cover
                      </CoverUploadButton>
                    </>
                  )}
                </div>
              </>
            )}

            <div
              className={`cursor-pointer absolute  left-[50%] translate-x-[-50%] -bottom-12 h-[112px] !w-[111px]`}
            >
              <div className="relative h-[112px] !w-[111px]">
                <Image
                  src={user.profile_image.path}
                  alt={user.display_name}
                  width={111}
                  height={112}
                  className="absolute rounded-full !h-[112px] !w-[111px] object-cover border-2 border-background-shade-3 !m-0"
                  // sizes={"512px"}
                />
                <div className="verifiedIcon absolute bottom-[2px] right-[-4px] !h-[34px] !w-[34px] !m-0">
                  <Image
                    src={verifyIcon}
                    alt={"verified icon"}
                    width={34}
                    height={34}
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={coverDetails}>
            <div className="w-full justify-center flex mt-3">
              <div className={topDetais}>
                <h5 className={profileName}>{user.display_name}</h5>
                <div className={shareBtns}></div>
              </div>
            </div>

            <div className="w-full justify-center flex mt-3">
              <div className={`pt-1 flex items-center gap-2 relative`}>
                <h6 className={code}>
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
                  <FiCopy className="text-2xl hover:text-brand-primary text-gray-shade-7" />
                </button>
              </div>
            </div>

            {(user.tiktok_username ||
              user.facebook_username ||
              user.instagram_username ||
              user.onlyfans_username ||
              user.twitch_username ||
              user.twitter_username ||
              user.website_url) && (
              <div className="w-full justify-center flex mt-3">
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
              <div className="w-full justify-center flex mt-4">
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
                    className={editProfileBtn}
                    onClick={() => followUser(user._id)}
                  />
                )}
              </div>
            )}

            {user.profile_bio && (
              <div className={`mt-4 w-full justify-center flex`}>
                <p
                  className={`text-16px font-normal leading-6 text-gray-shade-16 whitespace-pre-wrap text-center max-w-[776px]`}
                >
                  {user.profile_bio}
                </p>
              </div>
            )}

            {currentPageRoute.isProfilePage && (
              <UserProfileTabs
                loggedInUser={loggedInUser.account_address}
                account_address={router.query.account_address}
              />
            )}
            {currentPageRoute.isNFTProfilePage && (
              <NFTProfileTabs account_address={router.query.account_address} />
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
const profilePageHeader = ctl(`
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl
`);
const btnContainer = ctl(`
  flex max-w-[430px] w-full bg-black-shade-6 p-1.5 rounded-2xl mb-6 space-x-2
`);
const coverCard = ctl(`
bg-background-shade-3 rounded-xl
`);
const coverImageContainer = ctl(`
coverImageContainer relative rounded-2xl bg-center bg-cover bg-no-repeat w-full h-[31vh] bg-[url('/images/coverImage.png')]
`);

const coverDetails = ctl(`
mt-8 lg:mt-10 px-7 pt-7
`);
const topDetais = ctl(`
 flex flex-col lg:flex-row items-baseline justify-between
`);
const profileName = ctl(`
text-white text-20px font-semibold
`);
const shareBtns = ctl(`
flex items-center gap-3
`);
const copyContainer = ctl(`

`);
const code = ctl(`
text-white text-14px font-semibold
`);
const editProfileBtn = ctl(`
mt-5 !px-4 lg:mt-0 flex items-center justify-center gap-3 w-full max-w-[157px]
`);

const socialLinks = ctl(`text-white text-xl hover:text-brand-primary`);
