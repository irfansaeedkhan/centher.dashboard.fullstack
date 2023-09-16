import { useCallback, useEffect, useState } from "react";
import { getSentInvites } from "@/lib/org-team-members";
import { LoadingState } from "@/models/common";
import { customLog } from "@/utils/custom.log";
import { PendingInvite } from "./types";

export const useGetSentInvites = (): {
  loading: LoadingState;
  sentInvites: PendingInvite[];
  removeSentInvite: (inviteId: string) => void;
} => {
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [sentInvites, setSentInvites] = useState<PendingInvite[]>([]);

  const fetchSentInvites = useCallback(async () => {
    try {
      setLoading("loading");
      const _sentInvites = await getSentInvites();
      setSentInvites(_sentInvites);
      setLoading("loaded");
    } catch (err: any) {
      customLog(["development", "staging"], err);
      setLoading("failed");
    }
  }, []);

  useEffect(() => {
    fetchSentInvites();
  }, [fetchSentInvites]);

  const removeSentInvite = useCallback((inviteId: string) => {
    setSentInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
  }, []);

  return {
    loading,
    sentInvites,
    removeSentInvite,
  };
};
