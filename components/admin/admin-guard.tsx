import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { AppRoutes } from "@/constants/app.routes";

/**
 * QA-fix: gates the admin console UI. Server APIs under /api/admin/* already
 * enforce admin (403 for non-admins, Phase 8) — but the pages themselves
 * rendered the full console for anyone. Non-admins are redirected to feed;
 * nothing admin renders before the check resolves.
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await axiosApi369x.get("/api/admin/check");
        if (!cancelled) setAllowed(true);
      } catch {
        if (!cancelled) router.replace(AppRoutes.feed.index);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
};
