import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useRouter } from "next/router";
import { axiosNodeApi } from "@/utils/axios";
import { LoadingState } from "@/models/common";

import { SingleSearchUser } from "./_components";
import type { SearchResult } from "./_components";

// Current page imports
const Search: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (router.query.q) {
      getReults(router.query.q.toString());
    } else {
      setSearchResult([]);
      setIsDataLoading("loaded");
    }
  }, [router.query.q]);

  const getReults = (query: string) => {
    setIsDataLoading("loading");
    axiosNodeApi
      .get(`/api/search?q=${query}&limit=10&offset=0`)
      .then((response) => {
        setSearchResult(response.data.users as SearchResult[]);
        setIsDataLoading("loaded");
      })
      .catch(() => {
        setIsDataLoading("failed");
        setSearchResult([]);
      });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="md:w-[544px] sm:w-full">
        <div
          className={`animationTextHeading mb-8 lg:!text-[34px] md:!text-3xl sm:!text-2xl`}
        >
          Search Result:
        </div>
        <div className="flex flex-col gap-3">
          {searchResult.length > 0 &&
            isDataLoading === "loaded" &&
            searchResult.map((result) => {
              return <SingleSearchUser key={result._id} result={result} />;
            })}

          {searchResult.length <= 0 && isDataLoading === "loaded" && (
            <div className="text-brand-primary font-semibold">
              There is no result for this query!
            </div>
          )}

          {/* TODO: Talha - implement loading skeleton here */}
          {(isDataLoading === "loading" || isDataLoading === "idle") && (
            <div className="text-brand-primary font-semibold">Searching...</div>
          )}

          {isDataLoading === "failed" && (
            <div className="text-brand-primary font-semibold">
              Something went wrong!
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
