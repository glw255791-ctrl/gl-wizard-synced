"use client";

import dynamic from "next/dynamic";

const UserManagementPage = dynamic(
  () =>
    import("@/components/pages/user-management/user-management").then(
      (mod) => mod.UserManagementPage
    ),
  { ssr: false }
);

export function UserManagementClient() {
  return <UserManagementPage />;
}
