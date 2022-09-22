// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { Logout } from "@/assets/svgs";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/auth";

export const Sidebar = () => {
  const user = useAppSelector(selectUser);
  console.log(user);

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = e.currentTarget;
    button.disabled = true;

    axiosNodeApi
      .post("/api/auth/logout")
      .then(({ data }) => {
        button.disabled = false;
        toast.success(data.message_description ?? "Logged out successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      })
      .catch((err: any) => {
        button.disabled = false;
        toast.error(
          err.response.data?.message_description ?? "Something went wrong!"
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
      <div className={sectionWrapper}>
        <span className={sectionLabel}>WILL YOU GET OUT?</span>
        <div className={sectionWrapper}>
          <div className={itemWrapper}>
            <Logout />
            <button className={itemLabel} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-[15.5rem] 
  p-5 
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

const sideBarWrapperStyling = ctl(`flex flex-col gap-6`);
