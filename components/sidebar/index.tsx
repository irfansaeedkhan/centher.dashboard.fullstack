// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { Logout, SettingIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";
import SidebarAuthModal from "./sidebar.auth.modal";

export const Sidebar = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = e.currentTarget;
    button.disabled = true;

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

  return (
    <div className={sideBarWrapper}>
      <div className={sideBarWrapperStyling}>
        {SidebarSections.map((section) => {
          return <Section section={section} key={section.label} />;
        })}
      </div>
      {user && (
        <div className="flex flex-col gap-8">
          <div className={sectionWrapper}>
            <div className={sectionWrapper2}>
              <Link href={AppRoutes.profile.settings}>
                <a className={itemWrapper}>
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
                </a>
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
  );
};

const sideBarWrapper = ctl(`
  w-[15.5rem] 
  min-w-[15.5rem] 
  py-5 
  gap-8
  sm:hidden
  lg:flex
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

const sideBarWrapperStyling = ctl(`flex flex-col gap-6 px-5`);
