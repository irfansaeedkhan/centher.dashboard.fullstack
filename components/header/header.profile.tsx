import { Polygon } from "@/assets/svgs";
import { NODE_API_URL } from "@/constants/common";
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import Image from "next/future/image";
import Link from "next/link";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { FiArrowUpRight } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { useOnClickOutside } from "usehooks-ts";

interface HeaderProfileProps {
  onClickOutside: () => void;
}

const HeaderProfile: React.FC<HeaderProfileProps> = ({ onClickOutside }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  console.log(user);

  const handleClickOutside = () => {
    onClickOutside();
  };

  useOnClickOutside(ref, handleClickOutside);

  const copyText = () => {
    navigator.clipboard.writeText(user?.account_address);
    toast.success("Copied!");
  };

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = e.currentTarget;
    button.disabled = true;

    axiosNodeApi
      .post("/api/auth/logout")
      .then(({ data }) => {
        button.disabled = false;
        toast.success(data.message_description ?? "Logged out successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err: any) => {
        // If user is already logged out, reload the page
        if (err.response?.data?.message === "unauthenticated") {
          setTimeout(() => {
            window.location.reload();
          });
          return;
        }
        button.disabled = false;
        toast.error(
          err.response?.data?.message_description ?? "Something went wrong!"
        );
      });
  };

  return (
    <>
      <div className="absolute top-12 ">
        <Polygon />
      </div>
      <div
        ref={ref}
        className="absolute w-77 rounded-lg right-0 z-50 bg-black top-[3.5rem]"
      >
        <Image
          src={"/images/dummy-cover-img.jpg"}
          alt="dummy-cover-img.jpg"
          width={308}
          height={96}
          className="rounded-t-lg !h-[96px] object-cover"
        />
        <div className="flex flex-col gap-3 text-white ">
          <div className="flex gap-2 items-center px-6 py-4">
            <button>
              <div>
                {user && (
                  <div className="dpImagePreview relative">
                    <Image
                      src={`${NODE_API_URL}${user.profile_image}`}
                      alt="userProfile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
            </button>
            <div className="flex flex-col gap-1 ">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white">
                {user?.display_name}
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm">
                  {user?.account_address.slice(0, 4) +
                    "..." +
                    user?.account_address.slice(38, 42)}
                </p>
                <MdContentCopy
                  className="cursor-pointer text-sm text-white hover:text-brand-primary "
                  onClick={copyText}
                />
                <a
                  href={"/"}
                  target={"_blank"}
                  rel="noreferrer"
                  title="View on BSC Scan"
                >
                  <FiArrowUpRight className="cursor-pointer text-sm hover:text-brand-primary " />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end items-end px-6 py-4">
            <button
              className="rounded-lg bg-gray-shade-3 text-gray-shade-7 w-full text-sm hover:bg-yellow-theme hover:text-black font-semibold p-3"
              onClick={handleLogout}
            >
              Disconnect
            </button>
          </div>
          <hr className="border-gray-shade-border-color" />
          <div className="flex flex-col gap-3 px-6 pt-3 pb-4">
            <Link href={`/profile/${user?._id}`}>
              <a className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white hover:text-brand-primary">
                My Profile
              </a>
            </Link>
            <Link href={`/profile/settings`}>
              <a className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white hover:text-brand-primary">
                Profile Settings
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderProfile;
