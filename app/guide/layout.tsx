import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mode d'emploi" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
