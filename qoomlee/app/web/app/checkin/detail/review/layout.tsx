import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Check-in · Qoomlee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
