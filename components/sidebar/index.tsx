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
      className={`flex h-full w-full flex-col justify-between gap-8 overflow-y-auto bg-background-shade-1 py-5 font-monto`}
    >
      <div className={`flex flex-col gap-5`}>
        {SidebarSections.map((section) => {
          return <Section user={user} section={section} key={section.label} />;
        })}
      </div>
      {user && (
        <div className="flex flex-col gap-8">
          <div className={`flex flex-col gap-[6px] px-5`}>
            <span className={`text-[11px] font-bold text-gray-shade-11`}>
              WILL YOU GET OUT?
            </span>
            <div className={sectionWrapper2}>
              <div className={`flex items-center gap-2`}>
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
