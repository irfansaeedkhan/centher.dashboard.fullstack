import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { NFTCard, NFTCardData } from "@/components/nft.card";
import Button from "@/components/button";
import { NFTSaleStateFilter, OrderDirection } from "@/models/nft";
import { LoadingState } from "@/models/common";
import { HotNftEmptyIcon } from "@/assets/svgs";
import cn from "@/utils/cn";

interface Props {
  nfts: NFTCardData[];
  loadingNfts: LoadingState;
  offset: number;
  filter: NFTSaleStateFilter;
  orderDir: OrderDirection;
  fetchNFTs: () => void;
  updateOffset: () => void;
  updateFilter: (filter: NFTSaleStateFilter) => void;
  updateOrderDir: (orderDir: OrderDirection) => void;
}

export const CollectionNfts: React.FC<Props> = ({
  nfts,
  loadingNfts,
  offset,
  filter,
  orderDir,
  fetchNFTs,
  updateOffset,
  updateFilter,
  updateOrderDir,
}) => {
  const [lastNftRef, _lastNftInView, lastNftEntry] = useInView();

  useEffect(() => {
    if (lastNftEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNftRef, lastNftEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchNFTs();
    }
  }, [offset, fetchNFTs]);

  return (
    <div className="mt-6">
      <div className="flex flex-col items-center justify-between gap-5 fsm:flex-row">
        <div className="textGradient animationTextHeading leading-[42px] sm:text-xl lg:text-[24px]">
          NFTS
        </div>
        <div className="flex w-full max-w-[640px] flex-col items-center justify-center gap-3 fsm:flex-row fsm:justify-end fsm:gap-5">
          <div className="flex w-full max-w-[640px] flex-row  items-center justify-center gap-3 fsm:justify-end fsm:gap-5">
            <Button
              title={"All"}
              variant={filter === "All" ? "primary" : "secondary"}
              className="px-4 py-2  fsm:max-w-fit fsm:py-4"
              borderRounded="14px"
              onClick={() => {
                updateFilter("All");
              }}
            />

            <Button
              title={"Listed For Sale"}
              variant={filter === "List" ? "primary" : "secondary"}
              className="px-4 py-2  fsm:max-w-fit fsm:py-4"
              borderRounded="14px"
              onClick={() => {
                updateFilter("List");
              }}
            />
          </div>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <select
              className={`rounded-lg border-0 bg-black-shade-7 text-white focus:outline-none focus:ring-0 fsm:w-[400px] fsm:max-w-max fsm:px-10 fsm:py-3 fmd:w-[200px]`}
              value={orderDir}
              onChange={(e) => updateOrderDir(e.target.value as OrderDirection)}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div
          className={cn(
            "mx-auto grid w-max grid-cols-[minmax(0,280px)] gap-5 fsm:grid-cols-[minmax(0,235px)_minmax(0,235px)] fmd:grid-cols-[minmax(0,255px)_minmax(0,255px)] flg:grid-cols-[minmax(0,310px)_minmax(0,310px)_minmax(0,310px)] flg:gap-6 f2xl:grid-cols-[minmax(0,267px)_minmax(0,267px)_minmax(0,267px)_minmax(0,267px)]"
          )}
        >
          {nfts.map((data) => {
            return <NFTCard data={data} key={data.id} />;
          })}

          {(loadingNfts === "loading" || loadingNfts === "idle") && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <NftsSkeleton key={index} />
              ))}
            </>
          )}

          <div ref={lastNftRef} />
        </div>

        {loadingNfts === "loaded" && nfts.length === 0 && (
          <div>
            <div className="mt-[48px] flex justify-center">
              <HotNftEmptyIcon />
            </div>
            <div className="mt-6 flex justify-center text-xs font-semibold text-white">
              <p>No Nfts found yet!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
