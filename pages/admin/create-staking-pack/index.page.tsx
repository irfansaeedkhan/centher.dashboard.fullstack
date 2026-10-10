import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { AppRoutes } from "@/constants/app.routes";

const CreateStakingPack: NextPageWithLayout = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    apy: "",
    duration_days: "",
    claim_lockup_days: "",
    status: "active",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await axiosApi369x.post("/api/admin/staking-pools", {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        apy: Number(form.apy) || 0,
        duration_days: Number(form.duration_days) || 0,
        claim_lockup_days: Number(form.claim_lockup_days) || 0,
        status: form.status,
      });
      toast.success("Staking pack created");
      router.push(AppRoutes.admin.staking_packs);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not create staking pack"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex-grow bg-black-shade-3 p-4 font-monto">
      <div className="mx-auto mt-11 max-w-[720px] rounded-[10px] bg-background-shade-1 text-white">
        <h1 className="pl-10 pt-10 text-2xl">Create New Coin Pack</h1>
        <form className="mx-auto max-w-[496px] py-10" onSubmit={onSubmit}>
          <label className={formLabel}>Name</label>
          <input
            type="text"
            className={formField}
            placeholder="Name your coin pack here"
            value={form.name}
            onChange={set("name")}
            required
          />
          <div className={formDivider}>
            <div>
              <label className={formLabel}>Price</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="00"
                className={formField}
                value={form.price}
                onChange={set("price")}
              />
            </div>
            <div>
              <label className={formLabel}>Currency</label>
              <input
                type="text"
                disabled
                className="placeholder:textGradient mt-2 block w-full rounded-[10px] border-0 bg-white bg-opacity-5 px-4 py-3 focus:outline-none focus:ring-brand-primary"
                placeholder="NTR"
              />
            </div>
          </div>

          <div className={formDivider}>
            <div>
              <label className={formLabel}>Daily Profit (%)</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="00"
                className={formField}
                value={form.apy}
                onChange={set("apy")}
              />
            </div>
            <div>
              <label className={formLabel}>Duration (days)</label>
              <input
                type="number"
                min="0"
                step="1"
                className={formField}
                placeholder="0 = lifetime"
                value={form.duration_days}
                onChange={set("duration_days")}
              />
            </div>
          </div>

          <div className={formDivider}>
            <div className="w-full">
              <label className={formLabel}>Claim Lockup (days)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="00"
                className={formField}
                value={form.claim_lockup_days}
                onChange={set("claim_lockup_days")}
              />
            </div>
            <div className="w-full">
              <label className={formLabel}>Status</label>
              <select
                className="mt-2 block w-full rounded-[10px] border-0 bg-white bg-opacity-5 px-4 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                value={form.status}
                onChange={set("status")}
              >
                <option value="active" className="bg-black text-white">
                  Active
                </option>
                <option value="disabled" className="bg-black text-white">
                  Disable
                </option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="text-12 w-full rounded-[10px] bg-brand-primary px-4 py-3 font-bold text-black disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create New"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateStakingPack.getLayout = (page) => {
  return (
    <>
      <AdminHeader title="Create New Coin Pack" />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

const formLabel = `block`;
const formDivider = `flex gap-x-3 mt-3`;
const formField = `bg-white bg-opacity-5 block w-full placeholder:text-gray-shade-17 border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2`;

export default CreateStakingPack;
