import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { axiosNodeApi } from "@/utils/axios";
import SingleArchive from "./_components/single.archive";

interface IArchivedPost {
  _id: string;
  createdAt: string;
}

const ArchivedPosts: NextPageWithLayout = () => {
  const [archivedPosts, setArchivedPosts] = useState<IArchivedPost[] | null>(
    []
  );

  useEffect(() => {
    axiosNodeApi.get(`api/socials/posts/archived`).then((res) => {
      setArchivedPosts(res.data.post);
      console.log(res.data.post);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1005px]">
          <div className="flex justify-center mb-8">
            <div className="w-[474px] h-[37px] bg-gray-shade-9 rounded-md py-[10px] text-[#E7E8EE] text-center text-sm">
              Items in your archive are only visible to you.
            </div>
          </div>
          <div className="space-y-2">
            {archivedPosts?.map((post) => {
              return <SingleArchive post={post} key={post._id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

ArchivedPosts.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Archived Posts">{page}</AllPagesWrapper>;
};

export default ArchivedPosts;
