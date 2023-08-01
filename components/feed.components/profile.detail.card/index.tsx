import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { User } from "@/models/user";
import { ClipboardList, Followers, Following, Referrals } from "@/assets/svgs";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import ProfileModal from "@/components/modal/profile.modal";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useGetProfileCardDetails } from "./use.get.profile.card.details";

interface ProfileDetailCardProps {
  user: User;
}

export const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({
  user,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileCardDetails = useGetProfileCardDetails(user);
  const verificationTick = useVerificationTick({ user, shouldAnimate: true });

  const handleImageClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div
      className={clsx(
        `relative h-auto w-11/12 overflow-hidden rounded-10px bg-background-shade-3 pt-12 text-center fsm:w-[272px]`,
        !!profileCardDetails.posts_views_count && `pb-4`
      )}
    >
      <div
        className={`absolute left-0 top-0 h-[84px] w-full  bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url(${user?.cover_image})`,
        }}
      ></div>

      <div
        className={`relative mx-auto h-[60px] !w-[60px]`}
        onClick={handleImageClick}
      >
        <Image
          src={user.profile_image}
          className={`mx-auto h-[60px] w-[60px] cursor-pointer rounded-full object-cover`}
          alt={user.display_name}
          width={60}
          height={60}
          sizes={"256px"}
        />
      </div>

      <h3 className={`p-2`}>
        <Link
          href={{
            pathname: AppRoutes.profile.user_id,
            query: {
              user_id: user._id,
            },
          }}
          title={user.display_name}
          className={`flex items-center justify-center`}
        >
          <span
            className={clsx(
              `text-sm font-semibold text-white`,
              !user.display_name.includes(" ") && user.display_name.length > 20
                ? "block w-full max-w-full overflow-hidden truncate"
                : "line-clamp-1 w-fit text-ellipsis"
            )}
            title={user.display_name}
          >
            {user && sliceDisplayName(user.display_name)}
          </span>
          {!!verificationTick && (
            <span className="verifiedIcon ml-1 h-5 w-5  min-w-[1.25rem]">
              <Image
                src={verificationTick}
                alt={"Verified"}
                width={20}
                height={20}
              />
            </span>
          )}
        </Link>
      </h3>

      <div
        className={`flex flex-col items-center justify-center gap-2 bg-elevation-1 px-4 py-3`}
      >
        <div className="flex w-full items-center justify-between gap-10">
          <div className="flex w-1/2 flex-col items-start">
            <div className="mb-2 flex items-center gap-[6px]">
              <ClipboardList />
              <h4 className={clsx(label)}>Posts</h4>
            </div>
            <h5 className={clsx(count)}>
              {profileCardDetails.posts_count ?? "--"}
            </h5>
          </div>
          <div className="flex w-1/2 flex-col items-start">
            <div className="mb-2 flex items-center gap-[6px]">
              <Referrals />
              <h4 className={clsx(label)}>Referrals</h4>
            </div>
            <h5 className={clsx(count)}>
              {profileCardDetails.total_referrees ?? "--"}
            </h5>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-10">
          <div className="flex w-1/2 flex-col items-start">
            <div className="mb-2 flex items-center gap-[6px]">
              <Followers />
              <h4 className={clsx(label)}>Followers</h4>
            </div>
            <h5 className={clsx(count)}>
              {profileCardDetails.followers_count ?? "--"}
            </h5>
          </div>
          <div className="flex w-1/2 flex-col items-start">
            <div className="mb-2 flex items-center gap-[6px]">
              <Following />
              <h4 className={clsx(label)}>Following</h4>
            </div>
            <h5 className={clsx(count)}>
              {profileCardDetails.following_count ?? "--"}
            </h5>
          </div>
        </div>
      </div>

      {(profileCardDetails.profile_views_count === 0 ||
        profileCardDetails.profile_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Profile viewed by</h5>
          <h6 className={clsx(countBrand)}>
            {profileCardDetails.profile_views_count}
          </h6>
        </div>
      )}

      {(profileCardDetails.posts_views_count === 0 ||
        profileCardDetails.posts_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Posts views</h5>
          <h6 className={clsx(countBrand)}>
            {" "}
            {profileCardDetails.posts_views_count}
          </h6>
        </div>
      )}
      {isModalOpen && (
        <ProfileModal onClose={handleCloseModal} src={user.profile_image} />
      )}
    </div>
  );
};

const label = `text-12px font-medium text-gray-shade-7`;
const count = `text-14px font-semibold text-white`;
const countBrand = `text-12px font-semibold textGradient`;
