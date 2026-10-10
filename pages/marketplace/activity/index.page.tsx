import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { BackButton } from "@/components/button/back-button";
import { axiosCFS } from "@/utils/axios";
import { formatEther2Number } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";

interface Purchase {
  id: string;
  nftId: string;
  buyerId: string;
  sellerId: string;
  priceBnb: string;
  txHash: string | null;
  purchasedAt: string | null;
  nft: {
    id: string;
    name: string;
    imageUrl: string | null;
    collectionId: string;
  } | null;
  buyer: { display_name?: string } | null;
  seller: { display_name?: string } | null;
}

/**
 * Phase 13: the user's NFT trading history — bought and sold.
 */
const ActivityPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState<"bought" | "sold">("bought");
  const [bought, setBought] = useState<Purchase[]>([]);
  const [sold, setSold] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosCFS.get<{
        bought: Purchase[];
        sold: Purchase[];
      }>(`/api/marketplace/purchases`);
      setBought(data.bought ?? []);
      setSold(data.sold ?? []);
    } catch {
      // leave empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const list = tab === "bought" ? bought : sold;

  return (
    <>
      <Head>
        <title>My Trading Activity</title>
      </Head>
      <div className="mx-auto w-full max-w-[1160px] pb-16">
        <BackButton />
        <h1 className="textGradient mb-6 text-2xl font-semibold f2xl:text-4xl">
          Trading Activity
        </h1>
        <div className="mb-6 flex items-center gap-3">
          {(["bought", "sold"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "rounded-[10px] border px-5 py-2 text-sm font-semibold capitalize transition",
                tab === t
                  ? "border-primary bg-primary/10 text-white"
                  : "border-gray-shade-3 text-gray-shade-7 hover:bg-black-shade-4"
              )}
            >
              {t} ({t === "bought" ? bought.length : sold.length})
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-sm text-gray-shade-7">Loading history…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-gray-shade-7">
            No {tab} NFTs yet. Buy or bid on an NFT from the marketplace to see
            it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 fmd:grid-cols-2 fxl:grid-cols-3">
            {list.map((p) => (
              <Link
                key={p.id}
                href={{
                  pathname: AppRoutes.marketplace.nft,
                  query: {
                    collection: p.nft?.collectionId ?? "",
                    tokenId: p.nftId,
                  },
                }}
                className="flex items-center gap-4 rounded-[10px] bg-background-shade-3 p-4 transition hover:bg-black-shade-4"
              >
                {p.nft?.imageUrl ? (
                  <Image
                    src={p.nft.imageUrl}
                    alt={p.nft.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-[10px] object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-[10px] bg-gray-shade-3" />
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">
                    {p.nft?.name ?? "NFT"}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {formatEther2Number(p.priceBnb)} BNB
                  </span>
                  <span className="text-xs text-gray-shade-7">
                    {tab === "bought" ? "from " : "to "}
                    {(tab === "bought" ? p.seller : p.buyer)?.display_name ??
                      "user"}
                    {p.purchasedAt
                      ? ` · ${new Date(p.purchasedAt).toLocaleDateString()}`
                      : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

ActivityPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Trading Activity">{page}</AllPagesWrapper>;
};

export default ActivityPage;
