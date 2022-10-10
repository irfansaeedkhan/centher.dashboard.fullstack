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

//App imports
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import Button from "@/components/button";
import { getProfileImage } from "@/utils/helpers/get.profile.image";
import { Website } from "@/assets/svgs";
import { CameraIcon, CopyIcon, LinkIcon, EditIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { axiosNodeApi } from "@/utils/axios";

interface FollowUser {
  setFollowUser?: (arg0: boolean) => void;
}

const ProfileHeader: React.FC<FollowUser> = ({ setFollowUser }) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [_, copy] = useCopyToClipboard();
  const [desEditStatus, setDesEditStatus] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState("");
  const [description, setDescription] = useState<string>(
    "🔸 UIUX 🔥 Designer, check out my work on Dribbble and Instagram 👉 @uixamjad, please don't contact me contact me for yourproject 📮 hellouix.amjad@gmail.com, this email is just for receiving good and funny vibes. 🤣"
  );
  const [follow, setFollow] = useState<boolean>(false);

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
          `api/socials/follows/${user?._id}`
        );
        setFollowUser && setFollowUser(data.follow);
        setFollow(data.follow);
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

  const followUser = async (follower_id: string) => {
    try {
      const response = await axiosNodeApi.post("api/socials/follows", {
        follower_id,
      });
      if (response.data.message_description == "Follow user successfully") {
        setFollowUser && setFollowUser(true);
        setFollow(true);
      } else if (
        response.data.message_description == "Unfollow user successfully"
      ) {
        setFollowUser && setFollowUser(false);
        setFollow(false);
      }
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  // FIXME: Mubashir - Use memoization
  const isUserProfile = router.pathname === AppRoutes.user_profile;
  const isUserNFTProfile = router.pathname === AppRoutes.user_nft_profile;

  return (
    <div className={profilePageHeader}>
      <h1 className={title}>Profile</h1>
      <div className={btnContainer}>
        <Link href={{ pathname: AppRoutes.user_profile }}>
          <Button
            title={"Feed and Post"}
            variant={`${isUserProfile ? "v1" : "v2"}`}
            className="px-8"
          />
        </Link>
        <Link
          href={{
            pathname: AppRoutes.user_nft_profile,
            query: { tab: "owned" },
          }}
        >
          <Button
            title={"My NFT Profile"}
            variant={`${isUserNFTProfile ? "v1" : "v2"}`}
            className="px-8"
          />
        </Link>
      </div>

      {user && loggedInUser ? (
        <div className={coverCard}>
          <div className={coverImageContainer}>
            <button className={editCover}>
              <CameraIcon />
              Edit cover
            </button>
            <div className={profileImage}>
              <Image
                src={getProfileImage(user)}
                alt={user.display_name}
                width={111}
                height={112}
                className="rounded-full dpImagePreview"
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
                      <CopyIcon />
                    </button>
                  </div>
                  <button>
                    <TwitterShareButton
                      className="flex items-center"
                      url={shareUrl}
                    >
                      <Image
                        src="/images/twitter2.png"
                        width={24}
                        height={24}
                        alt="icon"
                      />
                    </TwitterShareButton>
                  </button>
                  <button>
                    {/* TODO: Waqar need to condition when user add website in his/her info only then user see this icon */}
                    <Website />
                  </button>
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
                <Button
                  title={follow ? "Unfollow" : "Follow"}
                  variant="v1"
                  className={editProfileBtn}
                  onClick={() => followUser(user._id)}
                />
              )}
            </div>
            <div className={textContent}>
              {desEditStatus ? (
                <div>
                  <textarea
                    className={textInputArea}
                    cols={12}
                    rows={3}
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={description}
                  />
                  <Button
                    title={"Save"}
                    variant="v1"
                    className={saveBtn}
                    onClick={() => {
                      setDesEditStatus(false);
                    }}
                  />
                </div>
              ) : (
                <p className={profileDescription}>
                  {description}
                  <button
                    className={editTxtIcon}
                    onClick={() => {
                      setDesEditStatus(true);
                    }}
                  >
                    <EditIcon className={editIcon} />
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};
export default ProfileHeader;

// styling
const profilePageHeader = ctl(`
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
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
flex items-center gap-8
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
const textInputArea = ctl(`
bg-transparent w-full rounded-10px text-16px font-normal leading-6 text-gray-shade-16 h-[203px] lg:h-[110px]
`);
const saveBtn = ctl(`
flex ml-auto mr-0  mt-2 w-full max-w-[90px] items-center justify-center
`);
const profileDescription = ctl(`
text-16px font-normal leading-6 text-gray-shade-16
`);
const editIcon = ctl(`
absolute -top-2 w-[20px] h-[20px] [&>*]:stroke-[#FEBF32]
`);
const editTxtIcon = ctl(`
ml-2 relative w-[20px] h-[20px]
`);
