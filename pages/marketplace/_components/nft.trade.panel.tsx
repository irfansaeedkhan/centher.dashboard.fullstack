import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "@/components/button";
import { axiosCFS } from "@/utils/axios";
import { formatEther2Number } from "@/utils/format.address";
import { eqAddress } from "@/lib/chat/utils";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { LoggedInUser } from "@/models/user";

interface Bid {
  id: string;
  nftId: string;
  bidderId: string;
  amountBnb: string;
  status: string;
  createdAt: string | null;
  bidder?: { display_name?: string } | null;
}

interface Props {
  nft: CFSNFTForPage;
  loggedInUser: LoggedInUser;
  refetchNFT: () => void;
}

const statusBadge: Record<string, string> = {
  active: "text-green-400 border-green-400/40 bg-green-400/10",
  outbid: "text-gray-shade-2 border-gray-shade-2/40 bg-gray-shade-2/10",
  accepted: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  rejected: "text-red-400 border-red-400/40 bg-red-400/10",
  withdrawn: "text-gray-shade-2 border-gray-shade-2/40 bg-gray-shade-2/10",
};

/**
 * Phase 13: DB-backed NFT trading panel — fixed-price buy, bid placement,
 * bid history, and owner accept/reject + bidder withdraw. Rendered on the
 * NFT detail page alongside the legacy on-chain flows.
 */
export const NFTTradePanel: React.FC<Props> = ({
  nft,
  loggedInUser,
  refetchNFT,
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [placing, setPlacing] = useState(false);
  const [buying, setBuying] = useState(false);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const isOwner = eqAddress(loggedInUser._id, nft.owner);
  const isListed = nft.saleState === "Sale" || nft.saleState === "List";
  const activeBids = bids.filter((b) => b.status === "active");
  const highestBid = activeBids[0] ?? null;

  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosCFS.get<{ bids: Bid[] }>(
        `/api/marketplace/nfts/${nft.id}/bids`
      );
      setBids(data.bids ?? []);
    } catch {
      // Bid book is supplementary — never crash the page over it.
    } finally {
      setLoading(false);
    }
  }, [nft.id]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const handleBuy = async () => {
    setBuying(true);
    try {
      await axiosCFS.post(`/api/marketplace/nfts/${nft.id}/buy`, {});
      toast.success("Purchase recorded — you are now the owner");
      refetchNFT();
      fetchBids();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Could not complete the purchase"
      );
    } finally {
      setBuying(false);
    }
  };

  const handlePlaceBid = async () => {
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid bid amount in BNB");
      return;
    }
    setPlacing(true);
    try {
      await axiosCFS.post(`/api/marketplace/nfts/${nft.id}/bids`, {
        amountBnb: bidAmount,
      });
      toast.success("Bid placed");
      setBidAmount("");
      fetchBids();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not place the bid");
    } finally {
      setPlacing(false);
    }
  };

  const handleBidAction = async (
    bidId: string,
    action: "accept" | "reject" | "withdraw"
  ) => {
    setActingOn(bidId);
    try {
      await axiosCFS.post(`/api/marketplace/bids/${bidId}/${action}`, {});
      toast.success(
        action === "accept"
          ? "Bid accepted — ownership transferred"
          : action === "reject"
          ? "Bid rejected"
          : "Bid withdrawn"
      );
      fetchBids();
      refetchNFT();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Action failed");
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className={panel}>
      <h4 className={panelTitle}>On-platform trading</h4>

      {highestBid && (
        <div className={greyBox}>
          <span className={greyTxt}>Highest bid</span>
          <span className="text-base font-bold text-white">
            {formatEther2Number(highestBid.amountBnb)} BNB
          </span>
        </div>
      )}

      {!isOwner && isListed && (
        <Button
          title={buying ? "Processing…" : "Buy Now"}
          variant="primary"
          disabled={buying}
          onClick={handleBuy}
          className="w-full rounded-[14px]"
        />
      )}

      {!isOwner && (
        <div className={greyBox}>
          <span className={greyTxt}>Place a bid (BNB)</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="0.0001"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={
                highestBid
                  ? `Above ${formatEther2Number(highestBid.amountBnb)}`
                  : "0.1"
              }
              className={input}
            />
            <Button
              title={placing ? "…" : "Bid"}
              variant="secondary"
              disabled={placing}
              onClick={handlePlaceBid}
              className="shrink-0 rounded-[14px] px-6"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h5 className="text-sm font-semibold text-white">
          Bid history ({bids.length})
        </h5>
        {loading ? (
          <p className={greyTxt}>Loading bids…</p>
        ) : bids.length === 0 ? (
          <p className={greyTxt}>No bids yet.</p>
        ) : (
          bids.map((bid) => {
            const mine = eqAddress(bid.bidderId, loggedInUser._id);
            const busy = actingOn === bid.id;
            return (
              <div key={bid.id} className={bidRow}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">
                    {formatEther2Number(bid.amountBnb)} BNB
                  </span>
                  <span className={greyTxt}>
                    {bid.bidder?.display_name ?? "Bidder"}
                    {mine ? " (you)" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "rounded-full border px-2 py-0.5 text-xs capitalize",
                      statusBadge[bid.status] ?? statusBadge.outbid
                    )}
                  >
                    {bid.status}
                  </span>
                  {bid.status === "active" && isOwner && (
                    <>
                      <button
                        disabled={busy}
                        onClick={() => handleBidAction(bid.id, "accept")}
                        className={smallBtn}
                      >
                        Accept
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleBidAction(bid.id, "reject")}
                        className={clsx(smallBtn, "text-red-400")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {bid.status === "active" && mine && !isOwner && (
                    <button
                      disabled={busy}
                      onClick={() => handleBidAction(bid.id, "withdraw")}
                      className={clsx(smallBtn, "text-gray-shade-2")}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const panel = `bg-background-shade-3 rounded-10px flex flex-col gap-4 p-6`;
const panelTitle = `text-sm font-semibold text-white`;
const greyBox = `flex flex-col gap-2`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
const input = `w-full rounded-[10px] border border-gray-shade-3 bg-black-shade-3 px-4 py-2.5 text-sm text-white placeholder:text-gray-shade-7 focus:border-primary focus:outline-none`;
const bidRow = `flex items-center justify-between gap-3 rounded-[10px] border border-gray-shade-3/50 px-4 py-3`;
const smallBtn = `rounded-full border border-gray-shade-3 px-3 py-1 text-xs font-semibold text-white transition hover:bg-black-shade-4 disabled:opacity-50`;
