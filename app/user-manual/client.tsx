"use client";

import dynamic from "next/dynamic";

const UserManualPage = dynamic(
  () =>
    import("@/components/pages/user-manual/user-manual").then(
      (mod) => mod.UserManualPage
    ),
  { ssr: false }
);

export function UserManualClient() {
  return <UserManualPage />;
}
