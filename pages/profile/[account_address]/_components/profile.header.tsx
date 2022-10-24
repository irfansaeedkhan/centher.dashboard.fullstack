// React, Next, NPM Packages
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/future/image";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import { TwitterShareButton } from "react-share";
import { Bars, Rings } from "react-loader-spinner";

// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import Button from "@/components/button";
import { CopySvg, TwitterSvg, Website, WebsiteIcon } from "@/assets/svgs";
import { CameraIcon, CopyIcon, EditIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { useUserMediaUpload } from "./upload.media.logic";

interface FollowUser {
  setFollowUser?: (arg0: boolean) => void;
}

const ProfileHeader: React.FC<FollowUser> = ({ setFollowUser }) => {
  const { incrementFollowersCount, decrementFollowersCount } =
    useProfileCardStore((state) => {
      return {
        incrementFollowersCount: state.incrementFollowersCount,
        decrementFollowersCount: state.decrementFollowersCount,
      };
    });
  const {
    displayImage,
    imageUrl,
    uploadImageButton,
    uploadImage,
    handleSelectedFile,
  } = useUserMediaUpload("cover image");
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [_, copy] = useCopyToClipboard();
  const [loader, setLoader] = useState(false);
  const [desEditStatus, setDesEditStatus] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [follow, setFollow] = useState<boolean>(false);
  const [showFollowButton, setShowFollowButton] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    setDescription(user?.profile_bio);
  }, [user]);

  useEffect(() => {
    setShareUrl(`${window.location.origin}${router.asPath}`);
  }, [router.asPath, user?.account_address]);

  // handle description data
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const { data } = await axiosNodeApi.get(
          `/api/socials/follows/${user?._id}`
        );
        setFollowUser && setFollowUser(data.follow);
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
  }, [user, setFollowUser]);

  const followUser = async (following_id: string) => {
    try {
      setLoadingState(true);
      const response = await axiosNodeApi.post("api/socials/follows", {
        following_id,
      });
      if (response.data.message == "follow_success") {
        setFollowUser && setFollowUser(true);
        setFollow(true);
        incrementFollowersCount();
      } else if (response.data.message == "unfollow_success") {
        setFollowUser && setFollowUser(false);
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

  // FIXME: Mubashir - Use memoization
  const isProfilePage = router.pathname === AppRoutes.profile.account_address;
  const isNFTProfilePage = router.pathname === AppRoutes.profile.nfts;

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
        >
          <a className="w-full">
            <Button
              title={"Feed and Post"}
              variant={`${isProfilePage ? "v1" : "v2"}`}
              className="px-8 py-4"
            />
          </a>
        </Link>
        <Link
          href={{
            pathname: AppRoutes.profile.nfts,
            query: {
              account_address: user?.account_address,
              tab: "owned",
            },
          }}
        >
          <a className="w-full">
            <Button
              title={
                loggedInUser?._id !== user?._id
                  ? "NFT Profile"
                  : "My NFT Profile"
              }
              variant={`${isNFTProfilePage ? "v1" : "v2"}`}
              className="px-8 py-4"
            />
          </a>
        </Link>
      </div>
      {user && loggedInUser ? (
        <div className={coverCard}>
          <div
            className={coverImageContainer}
            style={{
              backgroundImage: displayImage
                ? `url(${imageUrl})`
                : user.cover_image.path
                ? `url(${user.cover_image.path})`
                : `url(/images/coverImage.png)`,
            }}
          >
            {loggedInUser.account_address.toLowerCase() ===
            user.account_address.toLowerCase() ? (
              !uploadImageButton ? (
                <label className={`${editCover} `}>
                  <CameraIcon />
                  Edit cover
                  <input
                    type="file"
                    id="files-photo"
                    name="photos-file"
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setLoadingState(false);
                      handleSelectedFile(e);
                    }}
                  />{" "}
                </label>
              ) : loadingState ? (
                <button
                  className={` ${editCover} !bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-full max-w-[157px] h-[36px]`}
                >
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
                <button
                  className={uploadCover}
                  onClick={() => {
                    setLoadingState(true);
                    uploadImage();
                  }}
                >
                  <CameraIcon />
                  Upload cover
                </button>
              )
            ) : null}
            {/* <button className={editCover}>
              <CameraIcon />
              Edit cover
            </button> */}
            <div className={profileImage}>
              <Image
                src={user.profile_image.path}
                alt={user.display_name}
                width={111}
                height={112}
                className="rounded-full dpImagePreview h-[112px] w-[111px] object-cover"
              />
            </div>
          </div>
          <div className={coverDetails}>
            <div className={topDetais}>
              <div>
                <h5 className={profileName}>{user.display_name}</h5>
                <div className={shareBtns}>
                  <div className={copyContainer}>
                    <h6 className={code}>
                      {user.account_address.slice(0, 6) +
                        "..." +
                        user.account_address.slice(38, 42)}
                    </h6>
                    <button
                      className="copyBtn"
                      onClick={() => {
                        copy(user.account_address);
                        toast.success("Account Address Copied!");
                      }}
                    >
                      <CopySvg className="hover:stroke-brand-primary" />
                    </button>
                  </div>

                  {user.twitter_username && (
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {/* <Image
                        src="/images/twitter2.png"
                        width={24}
                        height={24}
                        alt="icon"
                      /> */}
                      <TwitterSvg className="hover:stroke-brand-primary" />
                    </a>
                  )}
                  {user.website_url && (
                    <a href={user.website_url} target="_blank" rel="noreferrer">
                      <WebsiteIcon className="hover:stroke-brand-primary" />
                    </a>
                  )}
                </div>
              </div>
              {loggedInUser.account_address.toLowerCase() ===
              user.account_address.toLowerCase() ? (
                <Link href={AppRoutes.profile.settings}>
                  <Button
                    title={"Edit Profile"}
                    variant="v1"
                    className={editProfileBtn}
                    Icon={<EditIcon className="w-[20px] [&>*]:stroke-black" />}
                  />
                </Link>
              ) : (
                showFollowButton &&
                (loadingState ? (
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
                ))
              )}
            </div>
            <div className={textContent}>
              <p className={profileDescription}>{description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[499px] w-full flex justify-center items-center">
          <Bars
            height="25"
            width="25"
            color="#FEBF32"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
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
  flex max-w-[430px] w-full bg-black-shade-6 p-1.5 rounded-2xl mb-6
`);
const coverCard = ctl(`
bg-background-shade-3 rounded-xl
`);
const coverImageContainer = ctl(`
coverImageContainer relative rounded-2xl bg-center bg-cover bg-no-repeat w-full h-[31vh] bg-[url('/images/coverImage.png')]
`);
const editCover = ctl(`
flex items-center gap-3 bg-white rounded-xl px-4 py-2 text-black-shade-3 font-semibold text-14px absolute right-6 bottom-4
`);
const profileImage = ctl(`
cursor-pointer absolute left-6 -bottom-12
`);
const coverDetails = ctl(`
mt-8 lg:mt-10 p-7
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
copyContainer pt-1 flex items-center gap-2 relative
`);
const code = ctl(`
text-white text-14px font-semibold
`);
const editProfileBtn = ctl(`
mt-5 lg:mt-0 flex items-center justify-center gap-3 w-full max-w-[157px]
`);
const textContent = ctl(`
mt-6
`);

const profileDescription = ctl(`
text-16px font-normal leading-6 text-gray-shade-16
`);

const uploadCover = ctl(`
flex items-center gap-3 bg-brand-primary hover:bg-brand-primary-dark rounded-xl px-4 py-2 text-black-shade-3 font-semibold text-14px absolute right-6 bottom-4
`);
