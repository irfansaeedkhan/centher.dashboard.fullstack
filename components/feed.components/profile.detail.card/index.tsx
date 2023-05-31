import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { User } from "@/models/user";
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
        `relative w-11/12 overflow-hidden rounded-10px bg-background-shade-3 pt-12 text-center fsm:w-[272px]`,
        !!profileCardDetails.posts_views_count && `pb-4`
      )}
    >
      <div
        className={`absolute top-0 left-0 h-[84px] w-full  bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url(${user?.cover_image.path})`,
        }}
      ></div>

      <div
        className={`relative mx-auto h-[60px] !w-[60px]`}
        onClick={handleImageClick}
      >
        <Image
          src={user.profile_image.path}
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
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: user.account_address,
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
                : "w-fit text-ellipsis line-clamp-1"
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
        className={`flex items-center justify-center gap-2 bg-background-shade-2 py-3 px-7`}
      >
        <div>
          <div>
            <h4 className={clsx(label, `mb-2`)}>Posts</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.posts_count ?? "--"}
            </h5>
          </div>
        </div>
        <div>
          <div>
            <h4 className={clsx(label, `mb-2`)}>Followers</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.followers_count ?? "--"}
            </h5>
          </div>
        </div>
        <div>
          <div>
            <h4 className={clsx(label, `mb-2`)}>Following</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.following_count ?? "--"}
            </h5>
          </div>
        </div>
        <div>
          <div>
            <h4 className={clsx(label, `mb-2`)}>Referrals</h4>
            <h5 className={clsx(count)}>
              {profileCardDetails.total_referrees ?? "--"}
            </h5>
          </div>
        </div>
      </div>

      {(profileCardDetails.profile_views_count === 0 ||
        profileCardDetails.profile_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Profile Viewed By</h5>
          <h6 className={clsx(countBrand)}>
            {profileCardDetails.profile_views_count}
          </h6>
        </div>
      )}

      {(profileCardDetails.posts_views_count === 0 ||
        profileCardDetails.posts_views_count) && (
        <div className={`flex items-center justify-between px-4 py-2`}>
          <h5 className={clsx(label)}>Your Posts Views</h5>
          <h6 className={clsx(countBrand)}>
            {" "}
            {profileCardDetails.posts_views_count}
          </h6>
        </div>
      )}
      {isModalOpen && (
        <ProfileModal
          onClose={handleCloseModal}
          src={user.profile_image.path}
        />
      )}
    </div>
  );
};

const label = `text-12px font-medium text-gray-shade-7`;
const count = `text-14px font-semibold text-white`;
const countBrand = `text-12px font-semibold text-brand-primary`;
