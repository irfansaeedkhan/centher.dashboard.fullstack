// React, Next, NPM Packages
import React, { RefObject, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { Logout, SettingIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";
import SidebarAuthModal from "./sidebar.auth.modal";
import clsx from "clsx";

interface SidebarMobileProps {
  sidebarOpen: boolean;
  onClose: () => void;
  openerRef: RefObject<HTMLDivElement | null>;
}

export const SidebarMobile: React.FC<SidebarMobileProps> = ({
  onClose,
  openerRef,
  sidebarOpen,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = e.currentTarget;
    button.disabled = true;
    onClose();
    axiosNodeApi
      .post("/api/auth/logout")
      .then(({ data }) => {
        button.disabled = false;
        toast.success(data.message_description ?? "Logged out successfully!");
        window.location.replace(AppRoutes.auth.login);
      })
      .catch((err: any) => {
        // If user is already logged out, reload the page
        if (err.response?.data?.message === "unauthenticated") {
          window.location.replace(AppRoutes.auth.login);
          return;
        }
        button.disabled = false;
        toast.error(
          err.response?.data?.message_description ?? "Something went wrong!"
        );
      });
  };

  useOnClickOutside(ref, (e) => {
    if (openerRef.current?.contains(e.target as Node)) {
      return;
    }
    onClose();
  });

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute top-[60px] z-50 duration-500 ",
        sidebarOpen ? " left-0" : " -left-full"
      )}
    >
      <div className={sideBarWrapper}>
        <div>
          {user && (
            <Link
              href={AppRoutes.nfts.create_nft}
              className={connectButton}
              onClick={onClose}
            >
              Create NFT
            </Link>
          )}
          <div className={sideBarWrapperStyling}>
            {SidebarSections.map((section) => {
              return (
                <Section
                  key={section.label}
                  user={user}
                  section={section}
                  onClose={onClose}
                />
              );
            })}
          </div>
        </div>
        {user && (
          <div className="flex flex-col gap-8">
            <div className={sectionWrapper}>
              <div className={sectionWrapper2}>
                <Link
                  href={AppRoutes.profile.settings}
                  className={itemWrapper}
                  onClick={onClose}
                >
                  <SettingIcon
                    className={
                      router.pathname.replaceAll("-", " ").includes("settings")
                        ? itemIconsActive
                        : itemIcons
                    }
                  />
                  <div
                    className={
                      router.pathname.replaceAll("-", " ").includes("settings")
                        ? itemLabelActive
                        : itemLabel
                    }
                  >
                    Settings
                  </div>
                </Link>
              </div>
            </div>
            <div className={sectionWrapper}>
              <span className={sectionLabel}>WILL YOU GET OUT?</span>
              <div className={sectionWrapper2}>
                <div className={itemWrapper}>
                  <Logout />
                  <button className={itemLabel} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!user && !isUserLoading && <SidebarAuthModal />}
      </div>
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-[15.5rem] 
  min-w-[15.5rem] 
  py-5 
  gap-8
  lg:hidden
  sm:flex
  flex-col
  font-monto
  justify-between  
  overflow-y-scroll
  h-[calc(100vh-60px)]
  bg-background-shade-1 
`);

const sectionWrapper = ctl(`
  flex
  gap-6 
  flex-col
  px-5
`);

const sectionWrapper2 = ctl(`
  flex
  gap-6 
  flex-col
`);

const sectionLabel = ctl(`
  font-bold
  text-[11px] 
  text-gray-shade-7 
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);

const itemLabelActive = ctl(`
  text-sm
  font-semibold 
  text-white 
`);

const itemIcons = ctl(`stroke-gray-shade-8`);

const itemIconsActive = ctl(`stroke-white`);

const sideBarWrapperStyling = ctl(`flex flex-col gap-6 px-5 mt-5`);

const connectButton = ctl(`
  px-6 
  py-2
  mx-5
  w-fit
  flex
  text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-brand-primary-dark 
`);
