// React, Next, NPM Packages
import React, { useEffect } from "react";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

interface PageProps {
  response: {
    status: "success" | "fail" | "error";
    message: string;
    message_description: string;
    token_type?: "account_email_verification";
  };
}

const VerifyAccountEmail: NextPage<PageProps> = ({ response }) => {
  const toastShown = React.useRef(false); // to prevent multiple toasts

  useEffect(() => {
    if (!toastShown.current) {
      if (response.status === "success") {
        toast.success(response.message_description);
      } else {
        toast.error(response.message_description);
      }
      toastShown.current = true;
    }
  }, [response]);

  return (
    <div className="min-h-screen bg-background-shade-1 pt-32">
      <h3 className="text-center text-white text-3xl">
        {response.message_description}
      </h3>

      <div className="text-center mt-8">
        <Link
          href={
            response.status === "success"
              ? AppRoutes.home
              : AppRoutes.auth.login
          }
        >
          <a className={connectButoon}>
            {response.status === "success" ? "Go to Home" : "Connect Again"}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default VerifyAccountEmail;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { token } = context.query;

  try {
    const { data: response } = await axiosNodeApi.patch(
      "/api/auth/verify-account-email",
      {
        token,
      }
    );
    return {
      props: {
        response,
      },
    };
  } catch (error: any) {
    return {
      props: {
        response: error.response.data ?? {
          status: "error",
          message: "server_error",
          message_description: "Something went wrong",
        },
      },
    };
  }
};

// Styles
const connectButoon = ctl(`
  px-6 
  py-2
  text-sm 
  rounded-lg 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-gray-shade-3 
  hover:text-brand-primary 
`);
