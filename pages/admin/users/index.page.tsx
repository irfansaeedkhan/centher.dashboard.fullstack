import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import { axiosApi369x } from "@/utils/axios/centher-api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminUsers: NextPageWithLayout = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi369x
      .get("/api/admin/users", { params: { limit: 100 } })
      .then((res) => setUsers(res.data?.users ?? []))
      .catch((err: any) => {
        if (err?.response?.status !== 403) {
          toast.error("Could not load users");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex-grow bg-black-shade-3 p-4 font-monto lg:pl-7 lg:pt-8">
      <h1 className="mb-6 text-2xl text-white">Users</h1>
      {loading ? (
        <p className="text-gray-shade-7">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-shade-7">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] bg-background-shade-1">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-gray-shade-3 text-gray-shade-7">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-shade-3 last:border-0"
                >
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-gray-shade-7">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        u.isAdmin
                          ? "bg-brand-primary/20 text-brand-primary"
                          : "bg-white/5 text-gray-shade-7"
                      }`}
                    >
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-shade-7">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

AdminUsers.getLayout = (page) => {
  return (
    <>
      <AdminHeader title="Users" />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

export default AdminUsers;
