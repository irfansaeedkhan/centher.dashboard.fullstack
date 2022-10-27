// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useRouter } from "next/router";
import { axiosNodeApi } from "@/utils/axios";
import SingleSearchUser from "./_components/single.search.user";

// Current page imports

const Notifications: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (router.query.q) {
      getReults(router.query.q);
    }
  }, [router]);

  const getReults = (query: any) => {
    axiosNodeApi
      .get(`api/search?q=${query}&limit=10&offset=0`)
      .then((response) => {
        setSearchResult(response.data.users);
        console.log(response.data.users);
      });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="md:w-auto sm:w-full">
        <div className={sectionName}>Search Result:</div>
        <div className="flex flex-col gap-3">
          {searchResult.length < 0 ? (
            searchResult.map((result, i) => {
              return <SingleSearchUser key={i} result={result} />;
            })
          ) : (
            <div className="text-brand-primary font-semibold">
              There is no result for this query!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Notifications.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Search">{page}</AllPagesWrapper>;
};

export default Notifications;

const sectionName = ctl(
  `animationTextHeading mb-8 lg:!text-[34px] md:!text-3xl sm:!text-2xl`
);
