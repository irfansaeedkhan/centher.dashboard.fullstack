// React, Next, NPM Packages
import Link from "next/link";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import { ProfilePageWrapper } from "./_components";

const NFTProfile: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className={nftProfilePageContainer}>
      <div className={tabsContainer}>
        <Link
          href={{
            pathname: AppRoutes.user_nfts_profile,
            query: {
              account_address: router.query.account_address,
              tab: "owned",
            },
          }}
        >
          <div
            className={`${tab} ${
              router.query?.tab === "owned" && "border-b-2 border-white"
            } `}
          >
            <h6
              className={`${tabTitle} ${
                router.query?.tab === "owned" && " !text-white"
              } `}
            >
              Owned <span className="text-12px">4</span>
            </h6>
          </div>
        </Link>
        <Link
          href={{
            pathname: AppRoutes.user_nfts_profile,
            query: {
              account_address: router.query.account_address,
              tab: "purchased",
            },
          }}
        >
          <div
            className={`${tab} ${
              router.query?.tab === "purchased" && "border-b-2 border-white"
            } `}
          >
            <h6
              className={`${tabTitle} ${
                router.query?.tab === "purchased" && "!text-white"
              } `}
            >
              Purchased <span className="text-12px">0</span>
            </h6>
          </div>
        </Link>
        <Link
          href={{
            pathname: AppRoutes.user_nfts_profile,
            query: {
              account_address: router.query.account_address,
              tab: "collections",
            },
          }}
        >
          <div
            className={`${tab} ${
              router.query?.tab === "collections" && "border-b-2 border-white"
            } `}
          >
            <h6
              className={`${tabTitle} ${
                router.query?.tab === "collections" && "!text-white"
              } `}
            >
              Collections <span className="text-12px">0</span>
            </h6>
          </div>
        </Link>
        <Link
          href={{
            pathname: AppRoutes.user_nfts_profile,
            query: {
              account_address: router.query.account_address,
              tab: "followers",
            },
          }}
        >
          <div
            className={`${tab} ${
              router.query?.tab === "followers" && "border-b-2 border-white"
            } `}
          >
            <h6
              className={`${tabTitle} ${
                router.query?.tab === "followers" && "!text-white"
              } `}
            >
              Followers <span className="text-12px">0</span>
            </h6>
          </div>
        </Link>
        <Link
          href={{
            pathname: AppRoutes.user_nfts_profile,
            query: {
              account_address: router.query.account_address,
              tab: "following",
            },
          }}
        >
          <div
            className={`${tab} ${
              router.query?.tab === "following" && "border-b-2 border-white"
            } `}
          >
            <h6
              className={`${tabTitle} ${
                router.query?.tab === "following" && "!text-white"
              } `}
            >
              Following <span className="text-12px">0</span>
            </h6>
          </div>
        </Link>
      </div>

      <div className={tabContentContainer}>
        {router.query?.tab === "owned" && (
          <h1 className={tabContent}>Owned (coming soon)</h1>
        )}
        {router.query?.tab === "purchased" && (
          <h1 className={tabContent}>Purchased (coming soon)</h1>
        )}
        {router.query?.tab === "collections" && (
          <h1 className={tabContent}>Collections (coming soon)</h1>
        )}
        {router.query?.tab === "followers" && (
          <h1 className={tabContent}>Followers (coming soon)</h1>
        )}
        {router.query?.tab === "following" && (
          <h1 className={tabContent}>Following (coming soon)</h1>
        )}
      </div>
    </div>
  );
};

NFTProfile.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper>{page}</ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfile;

// styling
const nftProfilePageContainer = ctl(`
`);

const tabsContainer = ctl(`
tabsBtnContainer flex items-center gap-14 border-b-2 border-gray-shade-3  overflow-x-auto w-full
`);

const tab = ctl(`
cursor-pointer p-3
`);

const tabTitle = ctl(`
text-gray-shade-2 flex items-center gap-3 text-18px font-semibold
`);

const tabContentContainer = ctl(`
tabContent flex items-center justify-center w-full h-[250px]
`);

const tabContent = ctl(`
textGradient font-semibold leading-[42px] pb-6 animationTextHeading text-34px w-fit
`);
