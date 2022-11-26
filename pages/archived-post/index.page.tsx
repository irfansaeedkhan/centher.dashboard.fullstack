import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { axiosNodeApi } from "@/utils/axios";
import SingleArchive from "./_components/single.archive";
import { SinglePostV2 } from "@/components/feed.components";
import { CompletedPost } from "@/models/post";

const ArchivedPosts: NextPageWithLayout = () => {
  const [archivedPosts, setArchivedPosts] = useState<CompletedPost[] | null>(
    []
  );

  useEffect(() => {
    axiosNodeApi.get(`api/socials/posts`).then((res) => {
      setArchivedPosts(res.data.posts);
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
          <div className="flex justify-center">
            <div className="space-y-3">
              {archivedPosts?.map((post) => {
                return (
                  <div key={post._id}>
                    <SinglePostV2
                      post={post}
                      postType={"archived"}
                      placement="profile-archived-page"
                    />
                  </div>
                );
              })}
            </div>
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
