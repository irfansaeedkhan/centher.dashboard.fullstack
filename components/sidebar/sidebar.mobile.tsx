// React, Next, NPM Packages
import React, { RefObject, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { IoSearchSharp } from "react-icons/io5";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { Logout } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { Section } from "./section";
import SidebarAuthModal from "./sidebar.auth.modal";
import { SidebarMobileSections } from "./sidebar-mobile-data";

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
      <div
        className={`flex h-[calc(100vh-60px)] w-[15.5rem] flex-col justify-between gap-8 overflow-y-scroll bg-background-shade-1 py-5 font-monto fxl:hidden`}
      >
        <div>
          <div className={`mb-4 flex items-center gap-2 pl-6 md:hidden`}>
            <IoSearchSharp className="text-xl text-gray-shade-7" />
            <Link
              href={AppRoutes.search}
              className={`text-sm font-semibold text-gray-shade-7`}
              onClick={onClose}
            >
              Search
            </Link>
          </div>
          <div className={`flex flex-col gap-6`}>
            {SidebarMobileSections.map((section) => {
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
              <span className={`text-[11px] font-bold text-gray-shade-8`}>
                WILL YOU GET OUT?
              </span>
              <div className={sectionWrapper2}>
                <div className={itemWrapper}>
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
    </div>
  );
};

const sectionWrapper = `flex gap-6 flex-col px-5`;

const sectionWrapper2 = `flex gap-6 flex-col`;

const itemWrapper = `flex gap-2 items-center`;
