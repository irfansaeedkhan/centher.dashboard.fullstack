import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Joi from "joi";
import { LoadingState } from "@/models/common";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

const ButtonsText = {
  loading: "Continue...",
};

// Must match scripts/seed.ts. Do not trust a mismatched NEXT_PUBLIC_DEMO_* env
// (e.g. Demo1234 without !) — that causes 401 "Login failed" on Vercel.
const DEMO_EMAIL = "demo@centher.io";
const DEMO_PASSWORD = "Demo1234!";

export const LoginForm: React.FC = () => {
  const { mutate } = useSWRConfig();

  const router = useRouter();

  const [emailLoading, setEmailLoading] = useState<LoadingState>("idle");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading("loading");
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        user?: unknown;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      toast.success("Welcome back");
      setEmailLoading("loaded");
      // Phase 1: do NOT seed `/api/users/me` with Better Auth's raw user —
      // its shape (`{id, email, name}`) is not `LoggedInUser`, and seeding it
      // crashed first paint (`user.display_name.includes` on undefined).
      // Revalidate from the server instead; the feed shows a loader meanwhile.
      await mutate("/api/users/me");
      router.push(AppRoutes.feed.index);
    } catch (error: unknown) {
      setEmailLoading("failed");
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className={`flex h-auto w-full flex-col gap-3`}>
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <p className="text-sm text-[#6B7280]">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-[14px] border border-[#2A2D3C] bg-transparent px-3 text-sm text-white outline-none"
          autoComplete="username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          className="h-11 w-full rounded-[14px] border border-[#2A2D3C] bg-transparent px-3 text-sm text-white outline-none"
          autoComplete="current-password"
          required
        />
        <Button
          title={emailLoading === "loading" ? ButtonsText.loading : "Sign in"}
          type="submit"
          variant="primary"
          className="flex h-11 w-full items-center justify-center text-[14px]"
          borderRounded="14px"
        />
      </form>
    </div>
  );
};

// Login Form Schema
export const LoginFormSchema = Joi.object()
  .keys({
    email: Joi.string()
      .label("Email")
      .email({ tlds: false })
      .lowercase()
      .trim()
      .required(),
    password: Joi.string().label("Password").trim().required(),
  })
  .messages({
    "string.empty": `{#label} is required`,
  });
