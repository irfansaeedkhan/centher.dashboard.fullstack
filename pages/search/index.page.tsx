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

const Search: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (router.query.q) {
      getReults(router.query.q);
    } else {
      setIsDataLoading(false);
    }
  }, [router]);

  const getReults = (query: any) => {
    setIsDataLoading(true);
    axiosNodeApi
      .get(`api/search?q=${query}&limit=10&offset=0`)
      .then((response) => {
        setSearchResult(response.data.users);
      });
    setIsDataLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="md:w-auto sm:w-full">
        <div
          className={`animationTextHeading mb-8 lg:!text-[34px] md:!text-3xl sm:!text-2xl`}
        >
          Search Result:
        </div>
        <div className="flex flex-col gap-3">
          {searchResult.length > 0 && !isDataLoading
            ? searchResult.map((result, i) => {
                return <SingleSearchUser key={i} result={result} />;
              })
            : searchResult.length <= 0 &&
              !isDataLoading && (
                <div className="text-brand-primary font-semibold">
                  There is no result for this query!
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

Search.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Search">{page}</AllPagesWrapper>;
};

export default Search;
