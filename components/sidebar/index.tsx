// React, Next, NPM Packages
import React from "react";
import toast from "react-hot-toast";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";
import { Logout } from "@/assets/svgs";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";
import SidebarAuthModal from "./sidebar.auth.modal";

export const Sidebar = () => {
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
    <div
      className={`w-[15.5rem] min-w-[15.5rem] py-5 gap-8 hidden fxl:flex flex-col font-monto justify-betwee overflow-y-scroll h-[calc(100vh-60px)] bg-background-shade-1`}
    >
      <div className={`flex flex-col gap-5`}>
        {SidebarSections.map((section) => {
          return <Section user={user} section={section} key={section.label} />;
        })}
      </div>
      {user && (
        <div className="flex flex-col gap-8">
          <div className={`flex gap-[6px] flex-col px-5`}>
            <span className={`font-bold text-[11px] text-gray-shade-11`}>
              WILL YOU GET OUT?
            </span>
            <div className={sectionWrapper2}>
              <div className={`flex gap-2 items-center`}>
                <Logout />
                <button
                  className={`text-sm font-semibold text-gray-shade-7`}
                  onClick={handleLogout}
                >
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

const sectionWrapper2 = `flex gap-6 flex-col`;
