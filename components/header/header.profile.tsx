import { NODE_API_URL } from "@/constants/common";
import useUser from "@/hooks/use.user";
import Image from "next/future/image";
import React, { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { useOnClickOutside } from "usehooks-ts";

interface HeaderProfileProps {
  onClickOutside: () => void;
}

const HeaderProfile: React.FC<HeaderProfileProps> = ({ onClickOutside }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const handleClickOutside = () => {
    onClickOutside();
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div
      ref={ref}
      className="absolute w-64 bordersetall right-0  gradientborders z-50"
      style={{ padding: "0.1rem", top: "3.5rem" }}
    >
      <div
        style={{ padding: "1rem" }}
        className="flex flex-col gap-3 text-white"
      >
        <span className="flex justify-between text-sm">
          <span className="text-lg font-semibold text-transparent bg-clip-text anim">
            Account
          </span>
        </span>
        <div className="flex gap-2 items-center">
          <button>
            <div>
              {user && (
                <div className="dpImagePreview cursor-pointer relative">
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
            <span className="flex gap-2 items-center">
              <button>
                <div className="dynamicTranss hoverText">
                  <span>12345...78903</span>
                </div>
              </button>
              <MdContentCopy
                className="cursor-pointer text-lg hoverText dynamicTranss "
                // onClick={copyText}
              />
              <a
                href={"/"}
                target={"_blank"}
                rel="noreferrer"
                title="View on BSC Scan"
              >
                <FiArrowUpRight className="cursor-pointer text-lg hoverText dynamicTranss " />
              </a>
            </span>
            <span className="text-sm" style={{ color: "#ABAFC4" }}>
              MetaMask
            </span>
          </div>
        </div>
        <div className="w-full flex justify-end items-end">
          <button
            className=" bordersetall text-sm hover:bg-yellow-theme hover:text-black font-semibold dynamicTranss"
            style={{ padding: "0.75rem" }}
            // onClick={handleLogout}
          >
            Disconnect
          </button>
        </div>
        <hr className="border-gray-700" />
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-transparent bg-clip-text anim">
            Referral Link
          </span>
          <span className="px-2 py-3 bordersetall w-full flex gap-2 items-center">
            <span className="w-4/5 overflow-x-scroll whitespace-nowrap">
              1232313123....2312312321
            </span>
            <MdContentCopy
              className="cursor-pointer text-lg hoverText dynamicTranss w-1/5 "
              // onClick={copyReferral}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
