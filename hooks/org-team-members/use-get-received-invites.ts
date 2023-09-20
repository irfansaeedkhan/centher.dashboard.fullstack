import { useCallback, useEffect, useState } from "react";
import { getReceivedInvites } from "@/lib/org-team-members";
import { LoadingState } from "@/models/common";
import { customLog } from "@/utils/custom.log";
import { PendingInvite } from "./types";

export const useGetReceivedInvites = (): {
  loading: LoadingState;
  receivedInvites: PendingInvite[];
  removeReceivedInvite: (inviteId: string) => void;
} => {
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [receivedInvites, setReceivedInvites] = useState<PendingInvite[]>([]);

  const fetchReceivedInvites = useCallback(async () => {
    try {
      setLoading("loading");
      const _receivedInvites = await getReceivedInvites();
      setReceivedInvites(_receivedInvites);
      setLoading("loaded");
    } catch (err: any) {
      customLog(["development", "staging"], err);
      setLoading("failed");
    }
  }, []);

  useEffect(() => {
    fetchReceivedInvites();
  }, [fetchReceivedInvites]);

  const removeReceivedInvite = useCallback((inviteId: string) => {
    setReceivedInvites((prev) =>
      prev.filter((invite) => invite._id !== inviteId)
    );
  }, []);

  return {
    loading,
    receivedInvites,
    removeReceivedInvite,
  };
};
