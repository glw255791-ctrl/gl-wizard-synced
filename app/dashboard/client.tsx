"use client";

import dynamic from "next/dynamic";

const MainMenu = dynamic(
  () =>
    import("@/components/pages/main-menu/main-menu").then((mod) => mod.MainMenu),
  { ssr: false }
);

export function MainMenuClient() {
  return <MainMenu />;
}
