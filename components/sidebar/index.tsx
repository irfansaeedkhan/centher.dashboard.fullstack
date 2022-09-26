// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";
import Link from "next/link";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { Logout } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";

export const Sidebar = () => {
  const { user } = useUser();

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
    <div className={sideBarWrapper}>
      <div className={sideBarWrapperStyling}>
        {SidebarSections.map((section) => {
          return <Section section={section} key={section.label} />;
        })}
      </div>
      {user ? (
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
      ) : (
        <div className="w-[218px] min-h-[200px] rounded-[32px] bg-black-shade-10 mx-4 bg-[url('/images/Rectangle.png')] p-6 flex flex-col gap-4">
          <div className="text-white font-semibold text-2xl">
            Get in to trading
          </div>
          <Link href={AppRoutes.auth.register}>
            <a className="text-black-shade-7 w-full py-1 bg-brand-primary hover:bg-brand-primary-dark font-semibold rounded-[10px] text-center">
              Register
            </a>
          </Link>
          <Link href={AppRoutes.auth.login}>
            <a className="text-gray-shade-7 w-full py-1 bg-black-shade-3 font-semibold rounded-[10px] text-center">
              Connect
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-[15.5rem] 
  py-5 
  gap-8
  hidden
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

const sideBarWrapperStyling = ctl(`flex flex-col gap-6 px-5`);
